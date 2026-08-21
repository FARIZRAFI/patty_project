# CLIENT PAYMENT GATEWAY REQUIREMENTS & INTEGRATION CONTRACT

**Document Version**: 1.0  
**Target Platform**: Patty Project UK  
**Status**: PENDING CLIENT DOCUMENTATION  
**Confidentiality**: Internal Technical Handover — Zero Secrets Included  

---

## 1. Executive Summary
This document defines the complete technical and operational contract required from the client to integrate their production payment gateway into the Patty Project platform. 

The Patty Project backend contains a provider-agnostic payment ledger, canonical state machine, atomic order transitions, and event-level webhook idempotency. Once the information in this checklist is supplied, the gateway adapter can be integrated without modifying internal order or business domain logic.

---

## 2. Gateway Integration Checklist

### A. Gateway Identity & Documentation
- [ ] **Provider / Gateway Name**: Official gateway brand and version.
- [ ] **API Documentation URL**: Developer portal, REST/GraphQL documentation.
- [ ] **SDK / Libraries**: Recommended language-specific SDKs (Python 3.12+ / FastAPI / Async HTTP) or direct REST endpoints.

### B. Environment & Endpoints
- [ ] **Sandbox / Testing Base URL**: `https://...`
- [ ] **Production Base URL**: `https://...`
- [ ] **Status / Healthcheck Endpoint**: Gateway operational health monitoring URL.

### C. Authentication & Credentials Architecture
- [ ] **Merchant / Account ID**: Identification string for Patty Project merchant account.
- [ ] **API Key / Client ID**: Public/secret key identifier.
- [ ] **API Secret / Private Key**: Server-to-server secret or private key format (e.g. Bearer Token, Basic Auth, RSA key pair).
- [ ] **Webhook Signature Secret**: Secret key used for cryptographic HMAC webhook verification.
- [ ] **Token Expiry & Rotation**: Method for OAuth2 token generation or static API key rotation policy.
- [ ] **IP Allowlisting / Certificates**: Any egress/ingress static IP requirements or mTLS certificate requirements.

### D. Payment Session Creation (`create_payment_session`)
- [ ] **Endpoint URL & HTTP Method**: (e.g., `POST /v1/checkout/sessions` or `POST /v1/orders`).
- [ ] **Required Headers**: (e.g., `Authorization`, `Content-Type`, `Idempotency-Key`).
- [ ] **Amount Representation**: 
  - Standard minor units (e.g., integer pence: `1599` for £15.99) OR decimal string/float (`"15.99"`).
- [ ] **Currency Parameter**: Standard ISO-4217 code (`GBP`).
- [ ] **Order Reference Parameter**: Parameter name for merchant order reference (internal order number `#PP-XXXX` or UUID).
- [ ] **Customer Metadata Fields**: Allowed customer fields (name, email, phone number, delivery address).
- [ ] **Hosted Checkout vs API-Direct**:
  - Hosted checkout redirect URL vs client token for embedded fields.
- [ ] **Return / Callback URLs**:
  - `success_url` (e.g. `https://order.pattyproject.co.uk/order-confirmation/{order_number}`)
  - `cancel_url` (e.g. `https://order.pattyproject.co.uk/checkout`)
  - `failure_url` (e.g. `https://order.pattyproject.co.uk/checkout?status=failed`)

### E. Payment Verification (`verify_payment`)
- [ ] **Verification Endpoint & Method**: (e.g., `GET /v1/payments/{transaction_id}`).
- [ ] **Authoritative Status Field**: JSON path to status string.
- [ ] **Status Vocabulary**: Complete enum of provider status codes (e.g. `succeeded`, `captured`, `failed`, `cancelled`, `pending`, `expired`).

### F. Inbound Webhooks & Server-to-Server Events (`webhook`)
- [ ] **Inbound Webhook HTTP Method**: `POST` to `https://api.pattyproject.co.uk/api/v1/payments/webhook`.
- [ ] **Cryptographic Signature Header**: Header key (e.g., `X-Signature`, `Stripe-Signature`, `X-Gateway-HMAC-SHA256`).
- [ ] **Signature Verification Algorithm**: (e.g., HMAC-SHA256 over timestamp + raw body with secret key).
- [ ] **Payload Structure**: JSON schema of webhook events.
- [ ] **Unique Event ID**: Location of gateway event ID in header or payload for idempotency.
- [ ] **Event Types**: List of event names (e.g., `payment.succeeded`, `payment.failed`, `payment.cancelled`, `refund.processed`).
- [ ] **Retry Policy & Replay Protection**: Gateway retry backoff schedule and timestamp tolerance window.

### G. Refunds (`process_refund`)
- [ ] **Refund Endpoint**: (e.g., `POST /v1/refunds` or `POST /v1/payments/{id}/refund`).
- [ ] **Partial Refund Support**: Ability to refund specific decimal/minor unit amounts up to total captured.
- [ ] **Refund Identifier**: Provider refund reference ID field in response.

### H. Cancellation & Expiry
- [ ] **Session Cancellation / Void API**: API to cancel an authorized or open session before capture.
- [ ] **Automatic Expiry Window**: Timeout duration for uncompleted checkout sessions.

---

## 3. Concept Mapping to Patty Project Internal Domain

| Provider Gateway Concept | Internal Patty Project Field | Status |
| :--- | :--- | :--- |
| Gateway Transaction / Charge ID | `Payment.transaction_id` | Configured |
| Gateway Unique Event ID | `PaymentEvent.gateway_event_id` | Configured |
| Authoritative Amount (GBP) | `Payment.amount` / `Order.total_amount` | Authoritative |
| Currency Code | `Payment.currency` (`GBP`) | Strict GBP |
| Merchant Order Number | `Order.order_number` (`#PP-XXXX`) | Configured |
| Merchant Order UUID | `Order.id` (UUIDv4) | Configured |
| Idempotency Key | `Payment.idempotency_key` | Configured |
| Payment Method Type | `Payment.payment_method_type` | `CARD`, `APPLE_PAY`, `GOOGLE_PAY` |
| Gateway Status $\rightarrow$ Success | `PaymentStatus.PAID` $\rightarrow$ `OrderStatus.INCOMING` | Mapped via State Machine |
| Gateway Status $\rightarrow$ Failed | `PaymentStatus.FAILED` $\rightarrow$ `OrderStatus.PENDING_PAYMENT` | Mapped via State Machine |
| Gateway Status $\rightarrow$ Cancelled | `PaymentStatus.CANCELLED` $\rightarrow$ `OrderStatus.PENDING_PAYMENT` | Mapped via State Machine |
| Gateway Status $\rightarrow$ Refunded | `PaymentStatus.REFUNDED` $\rightarrow$ `OrderStatus.REFUNDED` | Mapped via State Machine |

---

## 4. Environment Variables Specification

When the client gateway credentials are provided, set the following environment variables (do **NOT** commit actual secret values to repository):

```bash
# Environment Configuration
ENVIRONMENT=production
PAYMENT_PROVIDER=client_gateway

# Client Payment Gateway Credentials (Backend Only - NEVER in Frontend)
CLIENT_GATEWAY_ENVIRONMENT=production # or sandbox
CLIENT_GATEWAY_BASE_URL=https://api.clientgateway.com
CLIENT_GATEWAY_MERCHANT_ID=PENDING_CLIENT_DOCUMENTATION
CLIENT_GATEWAY_API_KEY=PENDING_CLIENT_DOCUMENTATION
CLIENT_GATEWAY_API_SECRET=PENDING_CLIENT_DOCUMENTATION
CLIENT_GATEWAY_WEBHOOK_SECRET=PENDING_CLIENT_DOCUMENTATION
```

---

## 5. Security & Architectural Guarantees
1. **Frontend Isolation**: Frontend never handles API secrets or issues direct webhook confirmations.
2. **Authoritative Amounts**: The backend calculates all order totals and passes the authoritative amount to the gateway.
3. **Delivery Radius Gating**: Delivery orders $> 2$ miles cannot initialize payment sessions.
4. **Idempotency Protection**: Dual-layer idempotency on session creation (`idempotency_key`) and webhook ingestion (`gateway_event_id`).
