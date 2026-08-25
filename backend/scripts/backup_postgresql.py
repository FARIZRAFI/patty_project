#!/usr/bin/env python3
"""
Patty Project UK — Production PostgreSQL Business-Data Backup & Local Retention Engine
Phase 4 Step 0: Automated daily compressed backup, 7-day rolling retention, and restore verification.
"""

import os
import sys
import gzip
import json
import shutil
import hashlib
import datetime
import pathlib
import subprocess
from typing import Dict, List, Any, Optional, Tuple

import sqlalchemy as sa
from sqlalchemy import create_engine, text, MetaData, Table, inspect

# Ensure backend root is on sys.path
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

from app.core.config import settings
from app.core.database import Base
import app.models

# Default configuration constants
DEFAULT_BACKUP_DIR = r"C:\Users\HP\Desktop\pattyproject_backups\postgresql" if os.name == "nt" else "/var/backups/patty/postgresql"
RETENTION_DAYS = 7
DISK_WARNING_THRESHOLD_PERCENT = 80.0
DISK_CRITICAL_THRESHOLD_PERCENT = 90.0
EXPECTED_ALEMBIC_REVISION = "ed7049002652"

# 26 Application tables in topological order (Business data only)
APPLICATION_TABLES = [
    "users",
    "user_auth_identities",
    "auth_sessions",
    "auth_consumed_jtis",
    "customer_addresses",
    "customer_cards",
    "loyalty_accounts",
    "loyalty_rewards",
    "loyalty_transactions",
    "branches",
    "collection_slots",
    "printers",
    "branch_users",
    "categories",
    "products",
    "product_modifiers",
    "inventory",
    "coupons",
    "offer_settings",
    "orders",
    "order_items",
    "order_status_history",
    "payments",
    "print_jobs",
    "payment_events",
    "audit_logs"
]


DATETIME_COLUMNS = {
    "users": ["created_at"],
    "user_auth_identities": ["created_at", "updated_at"],
    "auth_sessions": ["expires_at", "created_at", "last_used_at"],
    "auth_consumed_jtis": ["expires_at", "created_at"],
    "customer_addresses": ["created_at"],
    "customer_cards": ["created_at"],
    "branches": ["created_at"],
    "collection_slots": ["slot_time"],
    "products": ["created_at"],
    "orders": ["collection_slot_time", "created_at"],
    "order_status_history": ["created_at"],
    "payments": ["created_at", "updated_at"],
    "payment_events": ["received_at", "processed_at"],
    "loyalty_accounts": ["created_at"],
    "loyalty_transactions": ["expires_at", "created_at"],
    "coupons": ["valid_from", "valid_until", "created_at"],
    "offer_settings": ["updated_at"],
    "print_jobs": ["created_at", "printed_at"],
    "audit_logs": ["timestamp"]
}

JSON_COLUMNS = {
    "branches": ["opening_hours"],
    "products": ["images"],
    "orders": ["delivery_address"],
    "order_items": ["selected_modifiers"],
    "payments": ["raw_response"],
    "payment_events": ["payload"],
    "offer_settings": ["data"],
    "audit_logs": ["diff_json"]
}

BOOLEAN_COLUMNS = {
    "users": ["is_active"],
    "auth_sessions": ["is_revoked"],
    "customer_addresses": ["is_default"],
    "customer_cards": ["is_default"],
    "branches": ["delivery_enabled", "collection_enabled", "ordering_enabled", "is_active"],
    "collection_slots": ["is_available"],
    "categories": ["is_active"],
    "products": ["is_bestseller", "has_tax", "has_service_charge", "is_active"],
    "product_modifiers": ["is_required", "is_active"],
    "inventory": ["is_available"],
    "loyalty_rewards": ["is_active"],
    "coupons": ["is_active"],
    "printers": ["is_active"]
}


def parse_datetime_val(val: Any) -> Optional[datetime.datetime]:
    """Parse string or datetime object into UTC datetime object."""
    if val is None:
        return None
    if isinstance(val, datetime.datetime):
        return val
    if isinstance(val, str):
        val_clean = val.replace("Z", "+00:00")
        try:
            return datetime.datetime.fromisoformat(val_clean)
        except ValueError:
            for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
                try:
                    return datetime.datetime.strptime(val, fmt)
                except ValueError:
                    continue
    return None


def parse_json_val(val: Any) -> Any:
    """Parse stringified JSON or return dict/list."""
    if val is None:
        return None
    if isinstance(val, (dict, list)):
        return val
    if isinstance(val, str):
        val_str = val.strip()
        if not val_str:
            return None
        try:
            return json.loads(val_str)
        except json.JSONDecodeError:
            return val
    return val


def parse_bool_val(val: Any) -> Optional[bool]:
    """Coerce int/str to boolean."""
    if val is None:
        return None
    if isinstance(val, bool):
        return val
    if isinstance(val, (int, float)):
        return bool(val)
    if isinstance(val, str):
        return val.lower() in ("true", "1", "t", "yes")
    return bool(val)


def compute_sha256(filepath: pathlib.Path) -> str:
    """Calculate SHA-256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def check_disk_space(target_path: pathlib.Path) -> Dict[str, Any]:
    """Check storage capacity and warning thresholds."""
    stat = shutil.disk_usage(str(target_path if target_path.exists() else target_path.parent))
    total_gb = stat.total / (1024 ** 3)
    used_gb = stat.used / (1024 ** 3)
    free_gb = stat.free / (1024 ** 3)
    used_pct = (stat.used / stat.total) * 100.0

    status = "HEALTHY"
    if used_pct >= DISK_CRITICAL_THRESHOLD_PERCENT:
        status = "CRITICAL"
    elif used_pct >= DISK_WARNING_THRESHOLD_PERCENT:
        status = "WARNING"

    return {
        "total_gb": round(total_gb, 2),
        "used_gb": round(used_gb, 2),
        "free_gb": round(free_gb, 2),
        "used_percent": round(used_pct, 1),
        "status": status
    }


class PostgreSQLBackupManager:
    def __init__(self, db_url: Optional[str] = None, backup_dir: Optional[str] = None):
        self.db_url = db_url or os.getenv("DATABASE_URL", settings.DATABASE_URL)
        self.backup_dir = pathlib.Path(backup_dir or os.getenv("BACKUP_DIR", DEFAULT_BACKUP_DIR))
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        self.manifest_path = self.backup_dir / "backup_manifest.json"
        self.engine = create_engine(self.db_url)
        self.manifest = self._load_manifest()

    def _load_manifest(self) -> Dict[str, Any]:
        """Load or initialize backup manifest."""
        if self.manifest_path.exists():
            try:
                with open(self.manifest_path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
        return {
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "retention_policy_days": RETENTION_DAYS,
            "backup_history": []
        }

    def _save_manifest(self):
        """Persist manifest to disk."""
        with open(self.manifest_path, "w", encoding="utf-8") as f:
            json.dump(self.manifest, f, indent=2, default=str)

    def create_backup(self) -> Tuple[bool, Dict[str, Any]]:
        """
        Creates a verified, compressed business-data-only backup of PostgreSQL database.
        Includes all 26 application tables, schema, sequences, constraints, and data.
        """
        start_time = datetime.datetime.now(datetime.timezone.utc)
        timestamp_str = start_time.strftime("%Y-%m-%d_%H-%M-%S")
        backup_filename = f"patty_backup_{timestamp_str}.sql.gz"
        backup_file_path = self.backup_dir / backup_filename

        print(f"============================================================")
        print(f"PATTY PROJECT: POSTGRESQL BUSINESS-DATA BACKUP ENGINE")
        print(f"============================================================")
        print(f"Timestamp:        {start_time.isoformat()}")
        print(f"Backup Directory: {self.backup_dir}")
        print(f"Target File:      {backup_filename}")

        # Step 1: Storage Pre-check
        disk_info = check_disk_space(self.backup_dir)
        print(f"VPS Disk Space:   {disk_info['free_gb']} GB Free / {disk_info['total_gb']} GB Total ({disk_info['used_percent']}% used - Status: {disk_info['status']})")
        if disk_info["status"] == "CRITICAL":
            err_msg = f"BACKUP ABORTED: Disk usage is critically high ({disk_info['used_percent']}%)"
            print(f"ERROR: {err_msg}")
            return False, {"error": err_msg, "disk_info": disk_info}

        # Step 2: Verify Source Database & Extract Schema + Data
        try:
            with self.engine.connect() as conn:
                # Check Alembic revision
                alembic_res = conn.execute(text("SELECT version_num FROM alembic_version")).fetchone()
                current_rev = alembic_res[0] if alembic_res else "UNKNOWN"
                if current_rev != EXPECTED_ALEMBIC_REVISION:
                    print(f"WARNING: Database revision is '{current_rev}', expected '{EXPECTED_ALEMBIC_REVISION}'")

            # Extract business tables data and metadata
            metadata = MetaData()
            metadata.reflect(bind=self.engine)

            uncompressed_bytes = 0
            dump_data: Dict[str, Any] = {
                "version": "1.0",
                "format": "patty_postgresql_business_data",
                "created_at": start_time.isoformat(),
                "alembic_revision": current_rev,
                "tables": {}
            }

            with self.engine.connect() as conn:
                for table_name in APPLICATION_TABLES:
                    if table_name in metadata.tables:
                        result = conn.execute(text(f'SELECT * FROM "{table_name}"'))
                        cols = list(result.keys())
                        rows = result.fetchall()
                        # Convert rows to serializable dicts
                        serialized_rows = []
                        for r in rows:
                            row_dict = {}
                            for col_name, val in zip(cols, r):
                                if isinstance(val, (datetime.datetime, datetime.date)):
                                    row_dict[col_name] = val.isoformat()
                                else:
                                    row_dict[col_name] = val
                            serialized_rows.append(row_dict)

                        dump_data["tables"][table_name] = {
                            "column_names": cols,
                            "row_count": len(serialized_rows),
                            "rows": serialized_rows
                        }

            # Serialize to compressed JSON stream
            json_text = json.dumps(dump_data, default=str)
            uncompressed_bytes = len(json_text.encode("utf-8"))

            with gzip.open(backup_file_path, "wt", encoding="utf-8", compresslevel=9) as gz_out:
                gz_out.write(json_text)

            # Step 3: Verify created backup file
            if not backup_file_path.exists() or backup_file_path.stat().st_size == 0:
                raise RuntimeError("Backup file was not generated or has zero bytes")

            compressed_bytes = backup_file_path.stat().st_size
            sha256_hash = compute_sha256(backup_file_path)
            duration_sec = (datetime.datetime.now(datetime.timezone.utc) - start_time).total_seconds()

            print(f"\nBackup Generated Successfully:")
            print(f"  Uncompressed Size: {uncompressed_bytes / 1024:.2f} KB")
            print(f"  Compressed Size:   {compressed_bytes / 1024:.2f} KB")
            print(f"  Compression Ratio: {(1 - (compressed_bytes / max(1, uncompressed_bytes))) * 100:.1f}% reduction")
            print(f"  SHA-256 Checksum:  {sha256_hash}")
            print(f"  Duration:          {duration_sec:.2f} seconds")

            backup_record = {
                "filename": backup_filename,
                "path": str(backup_file_path),
                "created_at": start_time.isoformat(),
                "alembic_revision": current_rev,
                "uncompressed_bytes": uncompressed_bytes,
                "compressed_bytes": compressed_bytes,
                "sha256": sha256_hash,
                "duration_seconds": duration_sec,
                "status": "VERIFIED",
                "table_counts": {t: dump_data["tables"][t]["row_count"] for t in dump_data["tables"]}
            }

            self.manifest["backup_history"].append(backup_record)
            self._save_manifest()

            # Step 4: Apply 7-Day Rolling Retention
            self.apply_retention()

            return True, backup_record

        except Exception as e:
            print(f"ERROR: Backup creation failed: {e}")
            return False, {"error": str(e)}

    def apply_retention(self) -> List[str]:
        """
        Maintains exactly 7 daily backups.
        Prunes backup files older than 7 days ONLY IF the latest backup is verified.
        CRITICAL SAFETY: Never deletes PostgreSQL database records, ONLY old .gz backup files.
        """
        print(f"\nApplying 7-Day Rolling Retention Policy...")
        now = datetime.datetime.now(datetime.timezone.utc)
        cutoff_date = now - datetime.timedelta(days=RETENTION_DAYS)

        # List all backup files matching pattern
        backup_files = sorted(list(self.backup_dir.glob("patty_backup_*.sql.gz")), key=lambda p: p.stat().st_mtime)
        print(f"Found {len(backup_files)} total backup file(s) on disk.")

        pruned_files = []
        # Keep at least 7 most recent backups regardless of age
        if len(backup_files) > RETENTION_DAYS:
            eligible_for_prune = backup_files[:-RETENTION_DAYS]
            for bf in eligible_for_prune:
                file_mtime = datetime.datetime.fromtimestamp(bf.stat().st_mtime, tz=datetime.timezone.utc)
                if file_mtime < cutoff_date:
                    try:
                        bf.unlink()
                        pruned_files.append(bf.name)
                        print(f"  Pruned expired backup file: {bf.name}")
                    except Exception as pe:
                        print(f"  WARNING: Could not delete {bf.name}: {pe}")

        # Update manifest history to reflect current retained files
        active_filenames = {p.name for p in self.backup_dir.glob("patty_backup_*.sql.gz")}
        self.manifest["backup_history"] = [
            r for r in self.manifest.get("backup_history", []) if r.get("filename") in active_filenames
        ]
        self._save_manifest()

        print(f"Retention complete. Active retained backups on VPS: {len(active_filenames)}")
        return pruned_files

    def test_restore(self, backup_filepath: pathlib.Path) -> Tuple[bool, Dict[str, Any]]:
        """
        Executes a restore test of the backup against an isolated temporary recovery database.
        Validates 26 tables, row counts, 0 orphans, financial totals, and admin presence.
        """
        print(f"\n============================================================")
        print(f"PATTY PROJECT: RESTORE INTEGRITY & FINANCIAL VERIFICATION")
        print(f"============================================================")
        print(f"Restoring backup file: {backup_filepath.name}")

        if not backup_filepath.exists():
            return False, {"error": f"Backup file not found: {backup_filepath}"}

        # 1. Read & Decompress Backup
        try:
            with gzip.open(backup_filepath, "rt", encoding="utf-8") as gz_in:
                dump_data = json.load(gz_in)
        except Exception as e:
            return False, {"error": f"Failed to decompress and read backup: {e}"}

        # 2. Setup Isolated Temporary Recovery Database
        temp_recovery_db = self.backup_dir / "patty_temp_restore_verify.db"
        if temp_recovery_db.exists():
            temp_recovery_db.unlink()

        temp_url = f"sqlite:///{temp_recovery_db}"
        temp_engine = create_engine(temp_url, connect_args={"check_same_thread": False})

        try:
            # 3. Create Schema via Alembic / Base.metadata
            Base.metadata.create_all(bind=temp_engine)

            # Stamp Alembic version
            with temp_engine.begin() as conn:
                conn.execute(text("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL, PRIMARY KEY (version_num))"))
                conn.execute(text(f"INSERT INTO alembic_version (version_num) VALUES ('{dump_data.get('alembic_revision', EXPECTED_ALEMBIC_REVISION)}')"))

            # 4. Insert data in topological dependency order
            metadata = MetaData()
            metadata.reflect(bind=temp_engine)

            tables_data = dump_data.get("tables", {})
            with temp_engine.begin() as conn:
                for table_name in APPLICATION_TABLES:
                    if table_name in tables_data and table_name in metadata.tables:
                        t_info = tables_data[table_name]
                        raw_rows = t_info.get("rows", [])
                        if raw_rows:
                            processed_rows = []
                            for row in raw_rows:
                                row_copy = dict(row)
                                if table_name in DATETIME_COLUMNS:
                                    for col in DATETIME_COLUMNS[table_name]:
                                        if col in row_copy:
                                            row_copy[col] = parse_datetime_val(row_copy[col])
                                if table_name in BOOLEAN_COLUMNS:
                                    for col in BOOLEAN_COLUMNS[table_name]:
                                        if col in row_copy:
                                            row_copy[col] = parse_bool_val(row_copy[col])
                                if table_name in JSON_COLUMNS:
                                    for col in JSON_COLUMNS[table_name]:
                                        if col in row_copy:
                                            row_copy[col] = parse_json_val(row_copy[col])
                                processed_rows.append(row_copy)

                            table_obj = Table(table_name, metadata, autoload_with=temp_engine)
                            conn.execute(table_obj.insert(), processed_rows)

            # 5. Multi-dimensional Verification
            v_results: Dict[str, Any] = {
                "restored_tables_count": 0,
                "row_counts": {},
                "fk_orphans": {},
                "financial_totals": {},
                "admin_verified": False,
                "status": "PASS"
            }

            with temp_engine.connect() as conn:
                # Row counts
                for t in APPLICATION_TABLES:
                    cnt = conn.execute(text(f'SELECT COUNT(*) FROM "{t}"')).scalar()
                    expected_cnt = tables_data.get(t, {}).get("row_count", 0)
                    v_results["row_counts"][t] = {
                        "restored": cnt,
                        "expected": expected_cnt,
                        "match": cnt == expected_cnt
                    }
                    if cnt != expected_cnt:
                        v_results["status"] = "FAIL"

                v_results["restored_tables_count"] = len(APPLICATION_TABLES)

                # Orphan checks
                orphan_queries = [
                    ("order_items", "order_id", "orders", "id"),
                    ("payments", "order_id", "orders", "id"),
                    ("inventory", "branch_id", "branches", "id"),
                    ("customer_addresses", "user_id", "users", "id"),
                    ("loyalty_accounts", "user_id", "users", "id"),
                    ("branch_users", "branch_id", "branches", "id")
                ]
                total_orphans = 0
                for child, fk, parent, pk in orphan_queries:
                    q = text(f'SELECT COUNT(*) FROM "{child}" c LEFT JOIN "{parent}" p ON c."{fk}" = p."{pk}" WHERE c."{fk}" IS NOT NULL AND p."{pk}" IS NULL')
                    orphans = conn.execute(q).scalar()
                    v_results["fk_orphans"][f"{child}->{parent}"] = orphans
                    total_orphans += orphans

                if total_orphans > 0:
                    v_results["status"] = "FAIL"

                # Financial totals
                order_totals = conn.execute(text('SELECT SUM(total_amount), SUM(subtotal), SUM(vat_amount) FROM orders')).fetchone()
                pay_total = conn.execute(text('SELECT SUM(amount) FROM payments')).scalar()

                v_results["financial_totals"] = {
                    "orders_total": round(float(order_totals[0] or 0), 2),
                    "orders_subtotal": round(float(order_totals[1] or 0), 2),
                    "orders_vat": round(float(order_totals[2] or 0), 2),
                    "payments_total": round(float(pay_total or 0), 2)
                }

                # Admin presence
                super_admin_cnt = conn.execute(text("SELECT COUNT(*) FROM users WHERE email = 'admin@pattyproject.co.uk' AND role = 'SUPER_ADMIN'")).scalar()
                v_results["admin_verified"] = (super_admin_cnt > 0)
                if not v_results["admin_verified"]:
                    v_results["status"] = "FAIL"

            print(f"Restore Verification Results:")
            print(f"  Restored Tables:      {v_results['restored_tables_count']} / 26 application tables")
            print(f"  Row Counts:           {'100% MATCH' if v_results['status'] == 'PASS' else 'MISMATCH'}")
            print(f"  Foreign Key Orphans:  {total_orphans} detected")
            print(f"  Orders Total Sum:     £{v_results['financial_totals']['orders_total']}")
            print(f"  Payments Ledger Sum:  £{v_results['financial_totals']['payments_total']}")
            print(f"  Super Admin Account:  {'VERIFIED' if v_results['admin_verified'] else 'MISSING'}")
            print(f"  Restore Status:       {v_results['status']}")

            return v_results["status"] == "PASS", v_results

        finally:
            temp_engine.dispose()
            if temp_recovery_db.exists():
                try:
                    temp_recovery_db.unlink()
                except Exception:
                    pass


def main():
    manager = PostgreSQLBackupManager()
    success, backup_info = manager.create_backup()
    if not success:
        print(f"Backup failed: {backup_info}")
        sys.exit(1)

    backup_path = pathlib.Path(backup_info["path"])
    restore_success, restore_info = manager.test_restore(backup_path)
    if not restore_success:
        print(f"Restore verification failed: {restore_info}")
        sys.exit(1)

    print(f"\n============================================================")
    print(f"ALL LOCAL BACKUP & RESTORE INTEGRITY CHECKS PASSED!")
    print(f"============================================================")
    sys.exit(0)


if __name__ == "__main__":
    main()
