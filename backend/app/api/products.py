"""Products API."""

import re

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Product
from app.models.category import Category
from app.schemas.product import (
    ProductRead, ProductList, ProductCreate,
    ProductBulkCreate, ProductBulkResult,
)
from app.cache import cache_get, cache_set, cache_key

router = APIRouter()


def _slugify(text: str) -> str:
    """Convert a name to a URL-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


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


@router.post("/bulk", response_model=ProductBulkResult)
async def bulk_create_products(
    payload: ProductBulkCreate,
    db: AsyncSession = Depends(get_db),
):
    """Bulk-create products from an Excel upload.

    - Resolves category names to IDs automatically.
    - Skips rows where name is empty.
    - Returns a summary of created, skipped, and errored rows.
    """
    # Pre-fetch all categories into a name → id map (case-insensitive)
    cat_result = await db.execute(select(Category))
    category_map: dict[str, int] = {
        c.name.lower(): c.id for c in cat_result.scalars().all()
    }

    created: list[ProductRead] = []
    skipped = 0
    errors: list[str] = []

    for idx, item in enumerate(payload.products, start=1):
        if not item.name or not item.name.strip():
            skipped += 1
            continue

        try:
            category_id: int | None = None
            if item.category_name:
                category_id = category_map.get(item.category_name.lower())
                if category_id is None:
                    errors.append(
                        f"Row {idx} '{item.name}': category '{item.category_name}' not found — saved without category."
                    )

            slug = _slugify(item.name)

            product = Product(
                business_id=payload.business_id,
                category_id=category_id,
                name=item.name.strip(),
                slug=slug,
                description=item.description,
                price=item.price,
                currency=item.currency or "PHP",
                image_url=item.image_url,
                is_available=item.is_available,
            )
            db.add(product)
            await db.flush()
            await db.refresh(product)
            created.append(ProductRead.model_validate(product))
        except Exception as exc:
            errors.append(f"Row {idx} '{item.name}': {str(exc)}")

    return ProductBulkResult(
        created=len(created),
        skipped=skipped,
        errors=errors,
        items=created,
    )


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
