from abc import ABC, abstractmethod
from typing import Dict, Any
import uuid

class BasePaymentProvider(ABC):
    @abstractmethod
    async def create_payment_session(self, order_id: str, amount: float, currency: str = "GBP", customer_info: Dict[str, Any] = None) -> Dict[str, Any]:
        """Initializes payment session & returns checkout token or redirect URL."""
        pass

    @abstractmethod
    async def verify_webhook_signature(self, headers: Dict[str, str], body: bytes) -> bool:
        """Validates incoming webhook authenticity."""
        pass

    @abstractmethod
    async def process_refund(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        """Processes a refund via gateway."""
        pass

class MockPaymentProvider(BasePaymentProvider):
    """
    Built-in pluggable Mock Payment Provider for local dev & instant testing.
    Can be seamlessly swapped with Client Payment Provider Adapter once credentials are provided.
    """
    async def create_payment_session(self, order_id: str, amount: float, currency: str = "GBP", customer_info: Dict[str, Any] = None) -> Dict[str, Any]:
        tx_id = f"TXN_{uuid.uuid4().hex[:10].upper()}"
        return {
            "provider": "Client Payment Gateway (Mock Adapter)",
            "order_id": order_id,
            "transaction_id": tx_id,
            "amount": amount,
            "currency": currency,
            "status": "REQUIRES_PAYMENT_METHOD",
            "client_secret": f"sec_mock_{tx_id}",
            "payment_url": f"/mock-checkout/{tx_id}"
        }

    async def verify_webhook_signature(self, headers: Dict[str, str], body: bytes) -> bool:
        return True

    async def process_refund(self, transaction_id: str, amount: float) -> Dict[str, Any]:
        return {
            "status": "SUCCESS",
            "refund_id": f"ref_{uuid.uuid4().hex[:8]}",
            "amount": amount,
            "transaction_id": transaction_id
        }

# Active Provider instance (Abstract factory ready for client gateway swap)
payment_provider: BasePaymentProvider = MockPaymentProvider()
