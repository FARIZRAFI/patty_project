from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.product import Category, Product, ProductModifier, Inventory
from app.schemas.product import CategoryResponse, CategoryCreateRequest, ProductResponse, ProductCreateRequest, ProductUpdateRequest
from app.api.endpoints.auth import require_role
from app.models.user import UserRole, User

router = APIRouter()

@router.get("/categories", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    """Returns active menu categories sorted by display order."""
    return db.query(Category).filter(Category.is_active == True).order_by(Category.display_order.asc()).all()

@router.post("/categories", response_model=CategoryResponse)
def create_category(
    request: CategoryCreateRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin create new menu category."""
    clean_name = request.name.strip()
    slug_val = clean_name.lower().replace(" ", "-")
    
    existing = db.query(Category).filter(Category.slug == slug_val).first()
    if existing:
        slug_val = f"{slug_val}-{random.randint(100, 999)}"

    category = Category(
        name=clean_name,
        slug=slug_val,
        icon=request.icon or "hamburger",
        display_order=request.display_order or 0,
        is_active=True
    )
    db.add(category)
    db.commit()
    db.refresh(category)
    return category

@router.delete("/categories/{category_id}")
def delete_category(
    category_id: str,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin delete category."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully", "id": category_id}

@router.get("/products", response_model=List[ProductResponse])
def list_products(
    category_id: Optional[str] = Query(None),
    branch_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Returns active products filtered by category or branch inventory availability."""
    query = db.query(Product).filter(Product.is_active == True)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.all()

@router.get("/products/{product_id}", response_model=ProductResponse)
def get_product_details(product_id: str, db: Session = Depends(get_db)):
    """Returns detailed product model with add-ons and modifiers."""
    prod = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    return prod

import random

@router.post("/products", response_model=ProductResponse)
def create_product(
    request: ProductCreateRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin create new product with modifiers, allergens, and default stock."""
    sku_candidate = request.sku.strip() if request.sku and request.sku.strip() else f"PROD-{random.randint(1000, 9999)}"
    if db.query(Product).filter(Product.sku == sku_candidate).first():
        sku_candidate = f"{sku_candidate}-{random.randint(100, 999)}"

    prod = Product(
        category_id=request.category_id,
        name=request.name,
        sku=sku_candidate,
        short_description=request.short_description,
        full_description=request.full_description,
        allergens=request.allergens,
        ingredients=request.ingredients,
        image_url=request.image_url,
        images=request.images if request.images is not None else ([request.image_url] if request.image_url else []),
        base_price=request.base_price,
        compare_at_price=request.compare_at_price,
        rating=request.rating or 4.7,
        is_bestseller=request.is_bestseller,
        has_tax=request.has_tax,
        has_service_charge=request.has_service_charge,
        is_active=True
    )
    db.add(prod)
    db.flush()

    if request.modifiers:
        for mod in request.modifiers:
            if mod.get("name"):
                m = ProductModifier(
                    product_id=prod.id,
                    name=mod.get("name"),
                    price=float(mod.get("price", 0.0))
                )
                db.add(m)

    db.commit()
    db.refresh(prod)
    return prod

@router.put("/products/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    request: ProductUpdateRequest,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin update product details, allergens, ingredients, image_url, rating, and bestseller status."""
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    if request.category_id is not None:
        prod.category_id = request.category_id
    if request.name is not None:
        prod.name = request.name
    if request.sku is not None and request.sku.strip():
        prod.sku = request.sku.strip()
    if request.short_description is not None:
        prod.short_description = request.short_description
    if request.full_description is not None:
        prod.full_description = request.full_description
    if request.allergens is not None:
        prod.allergens = request.allergens
    if request.ingredients is not None:
        prod.ingredients = request.ingredients
    if request.image_url is not None:
        prod.image_url = request.image_url
    if request.images is not None:
        prod.images = request.images
    if request.base_price is not None:
        prod.base_price = request.base_price
    if request.compare_at_price is not None:
        prod.compare_at_price = request.compare_at_price
    if request.rating is not None:
        prod.rating = request.rating
    if request.is_bestseller is not None:
        prod.is_bestseller = request.is_bestseller
    if request.has_tax is not None:
        prod.has_tax = request.has_tax
    if request.has_service_charge is not None:
        prod.has_service_charge = request.has_service_charge
    if request.is_active is not None:
        prod.is_active = request.is_active

    if request.modifiers is not None:
        db.query(ProductModifier).filter(ProductModifier.product_id == prod.id).delete()
        for mod in request.modifiers:
            if mod.get("name"):
                m = ProductModifier(
                    product_id=prod.id,
                    name=mod.get("name"),
                    price=float(mod.get("price", 0.0))
                )
                db.add(m)

    db.commit()
    db.refresh(prod)
    return prod

@router.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    current_user: User = Depends(require_role([UserRole.SUPER_ADMIN, UserRole.BRANCH_ADMIN])),
    db: Session = Depends(get_db)
):
    """Admin delete a product."""
    prod = db.query(Product).filter(Product.id == product_id).first()
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(prod)
    db.commit()
    return {"message": "Product deleted successfully", "id": product_id}

