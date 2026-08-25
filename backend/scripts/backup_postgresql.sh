#!/usr/bin/env bash
# ==============================================================================
# Patty Project UK — Production PostgreSQL Daily Backup & Retention Runner
# Phase 4 Step 0: Automated Cron / Systemd Daily Execution Script
# ==============================================================================
set -euo pipefail

# Configuration
PROJECT_DIR="/opt/pattyproject/backend"
BACKUP_DIR="/var/backups/patty/postgresql"
LOG_FILE="/var/log/patty/backup.log"
PYTHON_BIN="/opt/pattyproject/backend/venv/bin/python"

# Ensure directories exist
mkdir -p "$BACKUP_DIR"
mkdir -p "$(dirname "$LOG_FILE")"

# Secure permissions (Owner read/write only)
chmod 700 "$BACKUP_DIR"

echo "=================================================================" >> "$LOG_FILE"
echo "Starting Patty Project PostgreSQL Backup: $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> "$LOG_FILE"

# Export Environment
export BACKUP_DIR="$BACKUP_DIR"
if [ -f "$PROJECT_DIR/.env" ]; then
    set -a
    source "$PROJECT_DIR/.env"
    set +a
fi

# Execute Backup Engine
if "$PYTHON_BIN" "$PROJECT_DIR/scripts/backup_postgresql.py" >> "$LOG_FILE" 2>&1; then
    echo "SUCCESS: PostgreSQL Daily Backup & Retention completed cleanly: $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> "$LOG_FILE"
    exit 0
else
    EXIT_CODE=$?
    echo "CRITICAL ALERT: PostgreSQL Backup failed with exit code $EXIT_CODE at $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> "$LOG_FILE"
    # Future: Trigger webhook / Telegram / Slack / Email alert here
    exit "$EXIT_CODE"
fi
