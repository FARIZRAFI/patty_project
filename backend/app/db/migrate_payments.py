"""
Database migration script to ensure the 'payments' table exists in the database
and align existing records.
"""
from app.core.database import engine, Base, SessionLocal
from app.models import Payment, Order, PaymentStatus, PaymentProvider

def run_migration():
    print("Running migration for Payment domain...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check and migrate existing orders if missing payment records
        orders = db.query(Order).all()
        migrated_count = 0
        for ord in orders:
            # Fix any delivery fee mismatch on existing records
            if ord.delivery_fee != 0.0:
                ord.delivery_fee = 0.0
                ord.total_amount = round(max(0.0, ord.subtotal - ord.discount_amount + 0.0 + ord.service_fee), 2)
            
            existing_payment = db.query(Payment).filter(Payment.order_id == ord.id).first()
            if not existing_payment:
                p = Payment(
                    order_id=ord.id,
                    provider=PaymentProvider.MOCK,
                    transaction_id=ord.payment_transaction_id or f"TXN_{ord.id[:8].upper()}",
                    amount=ord.total_amount,
                    currency="GBP",
                    status=PaymentStatus.PAID if ord.payment_status == "PAID" else PaymentStatus.PENDING,
                    payment_method_type="CARD"
                )
                db.add(p)
                migrated_count += 1
        
        db.commit()
        print(f"Migration completed successfully. Migrated {migrated_count} order payment records.")
    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
