from fastapi import APIRouter
from app.api.endpoints import auth, branches, products, orders, payments, loyalty, promotions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(branches.router, prefix="/branches", tags=["Branches"])
api_router.include_router(products.router, prefix="", tags=["Products & Categories"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments"])
api_router.include_router(loyalty.router, prefix="/loyalty", tags=["Loyalty"])
api_router.include_router(promotions.router, prefix="/promotions", tags=["Promotions"])
