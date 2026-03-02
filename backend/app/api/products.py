"""Products API."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Product
from app.schemas.product import ProductRead, ProductList, ProductCreate
from app.cache import cache_get, cache_set, cache_key

router = APIRouter()


@router.get("", response_model=list[ProductList])
async def list_products(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    business_id: int | None = Query(None),
    category_id: int | None = Query(None),
):
    """List products with optional filters."""
    cache_key_val = cache_key("products", skip, limit, business_id or 0, category_id or 0)
    cached = await cache_get(cache_key_val)
    if cached:
        return cached

    q = select(Product).where(Product.is_available == True)
    if business_id:
        q = q.where(Product.business_id == business_id)
    if category_id:
        q = q.where(Product.category_id == category_id)
    q = q.offset(skip).limit(limit).order_by(Product.name)
    result = await db.execute(q)
    items = result.scalars().all()
    data = [ProductList.model_validate(p) for p in items]
    await cache_set(cache_key_val, [c.model_dump() for c in data])
    return data


@router.post("", response_model=ProductRead)
async def create_product(
    payload: ProductCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a product."""
    prod = Product(**payload.model_dump())
    db.add(prod)
    await db.flush()
    await db.refresh(prod)
    return ProductRead.model_validate(prod)


@router.get("/{product_id}", response_model=ProductRead)
async def get_product(
    product_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a product by ID."""
    result = await db.execute(select(Product).where(Product.id == product_id))
    prod = result.scalar_one_or_none()
    if not prod:
        from fastapi import HTTPException
        raise HTTPException(404, "Product not found")
    return ProductRead.model_validate(prod)
