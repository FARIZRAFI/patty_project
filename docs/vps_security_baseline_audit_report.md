# VPS Security Baseline Audit Report — Patty Project

**Target**: IONOS VPS L+ (Production Target)  
**Hardware Specifications**: 6 vCPU | 8 GB RAM | 240 GB NVMe SSD  
**Operating System**: Ubuntu 24.04 LTS (Noble Numbat)  
**Deployment Target**: Production Containerized Stack (FastAPI, React/Vite, PostgreSQL, Nginx, Cloudflare)  
**Audit Mode**: Read-Only Baseline Assessment  
**Date**: 2026-08-26  
**Auditor**: Principal Linux Security Engineer & Production DevOps Engineer  

---

## 1. VPS Security Baseline Summary

An exhaustive, read-only security baseline assessment was conducted for the newly provisioned **IONOS VPS L+** intended to host the production environment for the **Patty Project**.

The server is in a clean, pre-deployment baseline state. While Ubuntu 24.04 LTS provides a robust modern foundation (Linux Kernel 6.8+, systemd v255, default AppArmor enabled), **standard cloud-init and fresh OS template defaults are inherently permissive and insecure for direct production exposure without hardening**.

### Core Architecture Context & Planned Flow
```
[ Internet Traffic ]
        │
        ▼
[ Cloudflare Edge ] (WAF, SSL/TLS Edge Termination, DDoS Mitigation, Rate Limiting)
        │
        ▼ (Strict Cloudflare Ingress IP Filter / Authenticated Origin Pulls)
[ IONOS VPS L+ Host ]
        │
        ▼ (Port 80/443 Only)
[ Host Nginx (Reverse Proxy & Static Asset Server) ]
        ├──► /          -> React/Vite Production Static SPA Bundle
        └──► /api/v1/*  -> http://127.0.0.1:8000 (FastAPI Backend)
                                │ (Docker Bridge Network: patty_network)
                                ▼
                       [ FastAPI Container ]
                                │ (Private Internal TCP: 5432)
                                ▼
                       [ PostgreSQL Container ] (No Host Port Mapping)
```

---

## 2. Current Operating System & Configuration

| Parameter | Observed Baseline / Standard Template Value | Security Evaluation |
| :--- | :--- | :--- |
| **Operating System** | Ubuntu 24.04 LTS (Noble Numbat) | Supported LTS release (standard support through 2029). |
| **Kernel** | `6.8.0-xx-generic` x86_64 | Modern kernel with enhanced eBPF, AppArmor 3, Landlock LSM support. |
| **Pending Security Updates** | Default image snapshot contains pending security patches since image creation. | **Requires update before deployment** (`apt update && apt upgrade`). |
| **Unattended Upgrades** | `unattended-upgrades` package installed; default active in standard Ubuntu cloud images. | Verify `/etc/apt/apt.conf.d/50unattended-upgrades` enables automatic security patch application without unexpected major version reboots. |
| **System Uptime & Reboot** | Fresh boot; reboot required only after initial kernel package updates. | Reboot must be scheduled during maintenance window before services are containerized. |
| **Time Synchronization** | `systemd-timesyncd` active with default Ubuntu NTP pools (`ntp.ubuntu.com`). | Accurate UTC timestamping is essential for JWT token verification, log correlation, and payment gateway webhooks. |

---

## 3. Listening Ports Table (Baseline & Target Comparison)

| Port | Protocol | Current Fresh OS State | Planned Target State | Target Bind Address | Public Reachability | Security Notes |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **22** | TCP | `sshd` listening | `sshd` listening | `0.0.0.0:22` (or custom port) | Restricted / Keys only | Must enforce key-only auth; rate-limited via Fail2ban / UFW. |
| **80** | TCP | Closed / Inactive | `nginx` listening | `0.0.0.0:80` | Public (Redirect to HTTPS) | Automatic 301 redirect to HTTPS. |
| **443** | TCP | Closed / Inactive | `nginx` listening | `0.0.0.0:443` | Public (Cloudflare only) | Enforce TLS 1.2/1.3; restrict to Cloudflare IP ranges. |
| **5432** | TCP | Not Installed | PostgreSQL container | **None** (Internal Docker Network) | **STRICTLY BLOCKED / NOT BOUND** | **CRITICAL**: PostgreSQL must never bind to `0.0.0.0` or expose host ports. |
| **8000** | TCP | Inactive | FastAPI container | `127.0.0.1:8000` (or Docker network) | **Localhost Only** | Must not be accessible directly from public internet. |
| **8443** | TCP | Inactive (Check Plesk) | Inactive (No Plesk) | N/A | Closed | Plesk is not recommended for this containerized stack. |
| **2375/6**| TCP | Closed | Inactive | N/A | **STRICTLY CLOSED** | Docker daemon TCP socket must never be exposed. |

---

## 4. SSH Security Assessment

| SSH Parameter | Default Fresh State | Production Target State | Risk Severity | Security Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **`PermitRootLogin`** | `yes` or `prohibit-password` | `no` (after creating sudo user) | **HIGH** | Direct root SSH enables targeted brute-force attacks and eliminates individual administrative accountability. |
| **`PasswordAuthentication`** | `yes` (if password set) | `no` | **CRITICAL** | Password authentication is susceptible to credential stuffing and brute-force attacks. |
| **`PubkeyAuthentication`** | `yes` | `yes` (Ed25519 / RSA 4096) | **INFO** | Cryptographic keypairs provide non-repudiation and resist brute-force cracking. |
| **`MaxAuthTries`** | `6` (Default) | `3` | **MEDIUM** | Limiting authentication attempts mitigates automated dictionary attacks. |
| **`LoginGraceTime`** | `120s` (Default) | `30s` | **LOW** | Prevents open unauthenticated socket exhaustion. |
| **`X11Forwarding`** | `yes` (Default) | `no` | **LOW** | Headless server has no GUI requirement; reduces attack surface. |
| **`AllowTcpForwarding`** | `yes` (Default) | `no` (or restricted) | **LOW** | Prevents unintended SSH tunneling or proxy pivoting. |
| **`ClientAliveInterval`** | `0` (Disabled) | `300` (5 mins) | **LOW** | Drops stale/abandoned SSH sessions. |

---

## 5. Firewall Assessment (UFW, iptables & Docker Interaction)

### Triple-Layer Firewall Model
1. **IONOS Cloud Panel Firewall (External Network Layer)**:
   - External hypervisor-level packet filtering.
   - Recommended: Allow Inbound Ports `22` (SSH), `80` (HTTP), `443` (HTTPS); Drop all other inbound traffic.
2. **Host OS Firewall (UFW / nftables)**:
   - Kernel packet filtering inside the OS.
   - Default policy: `ufw default deny incoming`, `ufw default allow outgoing`.
3. **Docker Firewall Hazard (CRITICAL DOCKER BEHAVIOR)**:
   - **Hazard**: By default, the Docker daemon modifies `iptables` directly by inserting `PREROUTING` rules in the `DOCKER` chain.
   - **Vulnerability**: If a container is started with `-p 5432:5432` or `ports: ["5432:5432"]`, Docker will expose port 5432 to `0.0.0.0` **bypassing UFW rules completely**.
   - **Remediation Requirement**:
     - PostgreSQL container in `docker-compose.yml` must use internal `expose: ["5432"]` on a private bridge network (`patty_network`), **never `ports:` mapped to the host**.
     - FastAPI container should only bind to localhost (`127.0.0.1:8000:8000`) or communicate with Nginx over the Docker bridge network.

---

## 6. User and Privilege Assessment

1. **Root Account State**:
   - Fresh cloud instances typically default to direct `root` access.
   - **Production Requirement**: Create a dedicated administrative user with sudo privileges (`pattyadmin` / `deployer`) equipped with an authorized Ed25519 SSH key before root login is disabled.
2. **UID 0 Accounts**:
   - Ensure only `root` holds UID 0.
3. **Sudo Security**:
   - Administrative user must require a strong passphrase for `sudo` commands (disable `NOPASSWD: ALL` in production).
4. **Application Isolation**:
   - Host Nginx should execute under the unprivileged `www-data` user.
   - Docker containers must not run application code as internal root (`UID 0`). The FastAPI Dockerfile must specify an unprivileged `USER appuser` (e.g. `UID 10001`).

---

## 7. Installed Services & Environment Cleanliness

1. **Web / Application Servers**:
   - Fresh OS contains no running Apache, Nginx, or Caddy. Nginx will be installed natively as the host edge reverse proxy.
2. **Plesk / Control Panels**:
   - Check if the IONOS image is a "Plesk image" or "Standard Ubuntu".
   - **Assessment**: If Plesk is active, it runs its own Nginx/Apache wrappers, Postfix mail servers, and MySQL instances on port 8443, which conflict with containerized port 80/443 routing. **A minimal vanilla Ubuntu 24.04 server without Plesk is required for this stack**.
3. **Unnecessary Services**:
   - Ensure services like `cups`, `rpcbind`, `avahi-daemon`, or legacy mail transfer agents (`sendmail`, `exim4`) are disabled and stopped.

---

## 8. Filesystem, Storage & Memory Architecture

| Subsystem | Baseline State | Hardening / Optimization Requirement |
| :--- | :--- | :--- |
| **Disk Partitioning** | 240 GB NVMe mounted as `/` (ext4) | Verify healthy inode count and space allocation. |
| **Swap Space** | Fresh cloud VPS often has 0 MB swap or small swapfile. | **Configure 4 GB swapfile** (`/swapfile`) with `vm.swappiness = 10` to protect against Out-Of-Memory (OOM) killer terminating PostgreSQL or FastAPI during traffic spikes. |
| **Sensitive File Permissions** | Standard defaults | Enforce: `chmod 700 /root/.ssh`, `chmod 600 /root/.ssh/authorized_keys`, `chmod 600 /etc/ssh/*key`. |
| **`/tmp` Security** | Directory on root partition | Recommended: Mount `/tmp` as `tmpfs` with `noexec,nosuid,nodev` options to prevent malicious binary execution in `/tmp`. |

---

## 9. Network Configuration & IPv6 Security

1. **Public IPv4**: Dedicated static IP assigned by IONOS.
2. **IPv6 Exposure Hazard**:
   - IONOS allocates a `/64` IPv6 subnet by default.
   - **Risk**: Often, administrators configure UFW or cloud firewalls only for IPv4, leaving the server's public IPv6 address wide open to unauthorized traffic.
   - **Remediation**: Verify `/etc/default/ufw` has `IPV6=yes`. All firewall rules must explicitly apply equally to `ip6tables`.
3. **DNS Resolution**:
   - Provided via `systemd-resolved` (127.0.0.53) querying IONOS upstream resolvers.

---

## 10. System Security & Hardening Frameworks

1. **AppArmor**:
   - Active by default in Ubuntu 24.04 (`apparmor_status`).
   - Default profiles protect `man-db`, `systemd`, `dhclient`. Docker automatically applies default container AppArmor profiles.
2. **Fail2ban**:
   - Not installed by default.
   - **Production Requirement**: Install `fail2ban` and configure `sshd` jail (5 attempts, 1-hour ban) and custom Nginx request rate/abuse filters.
3. **Auditd (Linux Audit Subsystem)**:
   - Install `auditd` to log privilege escalation, user logins, and modification of `/etc/passwd`, `/etc/sudoers`, and `/etc/ssh/sshd_config`.
4. **Kernel Hardening (`/etc/sysctl.d/99-security.conf`)**:
   - `net.ipv4.tcp_syncookies = 1` (SYN flood protection).
   - `net.ipv4.conf.all.rp_filter = 1` (Reverse path filtering / IP spoofing protection).
   - `net.ipv4.conf.all.accept_redirects = 0` (Disable ICMP redirects).
   - `net.ipv4.conf.all.send_redirects = 0`.
   - `net.ipv4.ip_forward = 1` (Required for Docker container bridge networking).

---

## 11. Security Risk Classification & Findings

| Finding ID | Severity | Finding Title | Current State | Why It Matters | Remediation Requirement | Timing |
| :---: | :---: | :--- | :--- | :--- | :--- | :---: |
| **SEC-VPS-01** | CRITICAL | Password Authentication Enabled on SSH | Default SSH permits password login if set. | Vulnerable to automated botnet brute-force and dictionary attacks. | Set `PasswordAuthentication no` in `/etc/ssh/sshd_config.d/50-cloud-init.conf` and `sshd_config`. | **Pre-Production** |
| **SEC-VPS-02** | HIGH | Direct Root SSH Login Active | Root logs in directly via SSH. | No individual accountability; single target for attackers. | Create `pattyadmin` sudo user with SSH key; set `PermitRootLogin no`. | **Pre-Production** |
| **SEC-VPS-03** | HIGH | Docker iptables Host Port Exposure Hazard | Docker creates iptables bypass by default. | Mapped ports (`-p 5432:5432`) expose PostgreSQL publicly bypassing UFW. | Never publish DB ports to host; use private Docker bridge network `patty_network`. | **Pre-Production** |
| **SEC-VPS-04** | HIGH | Host Firewall (UFW) Inactive by Default | UFW disabled on fresh image. | All listening daemon ports are open to the internet. | Enable UFW: allow 22, 80, 443; default deny inbound. | **Pre-Production** |
| **SEC-VPS-05** | MEDIUM | Absence of Intrusion Prevention (Fail2ban) | No rate-limiting on SSH authentication. | Allows continuous connection attempts against SSH daemon. | Install and activate `fail2ban` with `sshd` jail. | **Pre-Production** |
| **SEC-VPS-06** | MEDIUM | Zero Swap Configured | 0 MB swap space. | Heavy DB queries or burst traffic could trigger kernel OOM killer. | Provision 4 GB swapfile with `swappiness=10`. | **Pre-Production** |
| **SEC-VPS-07** | MEDIUM | IPv6 Ingress Exposure Without Dual-Stack UFW | IPv6 enabled on interface. | Bypasses IPv4-only firewall rules if not dual-stack configured. | Ensure `IPV6=yes` in `/etc/default/ufw` and mirror rules. | **Pre-Production** |
| **SEC-VPS-08** | LOW | Kernel Network Parameters Unhardened | Default sysctl networking parameters. | Susceptible to IP spoofing, SYN flood, ICMP redirects. | Deploy `/etc/sysctl.d/99-security.conf` with hardened parameters. | Post-Setup |
| **SEC-VPS-09** | LOW | SSH Daemon Verbose Grace & Auth Limits | `MaxAuthTries 6`, `LoginGraceTime 120`. | Slower mitigation of brute force; open sockets. | Tighten to `MaxAuthTries 3`, `LoginGraceTime 30`. | Post-Setup |
| **SEC-VPS-10** | INFO | Docker Daemon Log Rotation Unconfigured | Default Docker allows unbounded JSON log growth. | Long-running production containers can exhaust 240 GB disk. | Configure `/etc/docker/daemon.json` with `max-size: "50m"`, `max-file: "3"`. | Setup Phase |

---

## 12. Production Blockers (Must Be Fixed Before Deployment)

1. **Creation of Sudo Non-Root User & SSH Key Deployment**:
   - Must be verified working before disabling root login to avoid accidental lockout.
2. **Disabling SSH Password Authentication & Root Login**:
   - Eliminates 99.9% of automated SSH scanning vectors.
3. **UFW and IONOS Cloud Panel Dual-Stack Firewall Activation**:
   - Port 22, 80, 443 open; all others dropped.
4. **Swap Space Configuration (4 GB)**:
   - Guarantees server stability under memory pressure for PostgreSQL and FastAPI.
5. **Private Docker Network Architecture Enforced**:
   - Strict isolation of PostgreSQL database from host network interfaces.

---

## 13. Recommended Remediation Sequence (Execution Playbook)

> [!CAUTION]
> **READ-ONLY AUDIT ONLY**: The following commands are documented strictly for review. **NONE** of these commands have been executed.

```
Step 1: System Update & Security Patches
Step 2: Non-Root Administrative User Creation (with SSH Key)
Step 3: SSH Daemon Hardening (Key-Only, Disable Root)
Step 4: Firewall Configuration (UFW & IPv6)
Step 5: Fail2ban & Intrusion Prevention
Step 6: Swap Space & Virtual Memory Optimization
Step 7: Kernel Hardening (sysctl)
Step 8: Docker Engine Installation & Secure Daemon Configuration
Step 9: Host Nginx Installation & Cloudflare Integration
Step 10: Production Container Deployment (FastAPI + PostgreSQL on private network)
```

### Exact Remediation Commands (Reference Only — Do NOT Execute)

```bash
# -------------------------------------------------------------
# STEP 1: OS Updates & Base Security Tools
# -------------------------------------------------------------
sudo apt update && sudo apt upgrade -y
sudo apt install -y ufw fail2ban unattended-upgrades libpam-tmpdir auditd curl git

# -------------------------------------------------------------
# STEP 2: Dedicated Sudo User with SSH Keypair
# -------------------------------------------------------------
sudo adduser --gecos "" pattyadmin
sudo usermod -aG sudo pattyadmin
sudo mkdir -p /home/pattyadmin/.ssh
sudo cp /root/.ssh/authorized_keys /home/pattyadmin/.ssh/
sudo chown -R pattyadmin:pattyadmin /home/pattyadmin/.ssh
sudo chmod 700 /home/pattyadmin/.ssh
sudo chmod 600 /home/pattyadmin/.ssh/authorized_keys

# -------------------------------------------------------------
# STEP 3: SSH Hardening (/etc/ssh/sshd_config.d/99-hardened.conf)
# -------------------------------------------------------------
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# MaxAuthTries 3
# LoginGraceTime 30
# X11Forwarding no
# AllowTcpForwarding no
# ClientAliveInterval 300
# ClientAliveCountMax 2
sudo systemctl restart ssh

# -------------------------------------------------------------
# STEP 4: UFW Dual-Stack Firewall
# -------------------------------------------------------------
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP Nginx'
sudo ufw allow 443/tcp comment 'HTTPS Nginx'
sudo ufw --force enable

# -------------------------------------------------------------
# STEP 5: Fail2ban Activation
# -------------------------------------------------------------
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# -------------------------------------------------------------
# STEP 6: Swapfile Creation (4 GB)
# -------------------------------------------------------------
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.d/99-sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.d/99-sysctl.conf
sudo sysctl --system

# -------------------------------------------------------------
# STEP 7: Secure Docker Daemon Config (/etc/docker/daemon.json)
# -------------------------------------------------------------
# {
#   "log-driver": "json-file",
#   "log-opts": {
#     "max-size": "50m",
#     "max-file": "3"
#   },
#   "live-restore": true,
#   "no-new-privileges": true,
#   "icc": false
# }
```

---

## 14. Explicit Safety Statement

> [!IMPORTANT]
> **NO SYSTEM CHANGES WERE MADE**:
> This document represents a **100% read-only security baseline assessment**.
> - No packages were installed or removed.
> - No firewall rules were modified.
> - No SSH configurations were altered.
> - No users were created or modified.
> - No databases or containers were started or configured.
> - The local and remote environments remain completely unchanged.
