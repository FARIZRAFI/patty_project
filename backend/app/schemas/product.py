from typing import Optional, List
from pydantic import BaseModel

class ProductModifierResponse(BaseModel):
    id: str
    name: str
    price: float
    is_required: bool
    is_active: bool

    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: str
    name: str
    slug: str
    icon: Optional[str] = None
    display_order: int

    class Config:
        from_attributes = True

class CategoryCreateRequest(BaseModel):
    name: str
    icon: Optional[str] = None
    display_order: Optional[int] = 0

class ProductResponse(BaseModel):
    id: str
    category_id: str
    name: str
    sku: str
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    allergens: Optional[str] = None
    ingredients: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = []
    base_price: float
    compare_at_price: Optional[float] = None
    rating: float
    reviews_count: int
    is_bestseller: bool
    has_tax: bool
    has_service_charge: bool
    vat_category: str
    is_active: bool
    modifiers: List[ProductModifierResponse] = []

    class Config:
        from_attributes = True

class ProductCreateRequest(BaseModel):
    category_id: str
    name: str
    sku: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    allergens: Optional[str] = None
    ingredients: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = []
    base_price: float
    compare_at_price: Optional[float] = None
    rating: Optional[float] = 4.7
    is_bestseller: bool = False
    has_tax: bool = True
    has_service_charge: bool = False
    stock_quantity: int = 100
    modifiers: List[dict] = []

class ProductUpdateRequest(BaseModel):
    category_id: Optional[str] = None
    name: Optional[str] = None
    sku: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    allergens: Optional[str] = None
    ingredients: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[List[str]] = None
    base_price: Optional[float] = None
    compare_at_price: Optional[float] = None
    rating: Optional[float] = None
    is_bestseller: Optional[bool] = None
    has_tax: Optional[bool] = None
    has_service_charge: Optional[bool] = None
    is_active: Optional[bool] = None
    modifiers: Optional[List[dict]] = None

