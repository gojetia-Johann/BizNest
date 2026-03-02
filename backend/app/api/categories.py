"""Categories API."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Category
from app.schemas.category import CategoryRead, CategoryCreate
from app.cache import cache_get, cache_set, cache_key

router = APIRouter()


@router.get("", response_model=list[CategoryRead])
async def list_categories(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
):
    """List all categories."""
    cache_key_val = cache_key("categories", skip, limit)
    cached = await cache_get(cache_key_val)
    if cached:
        return cached

    result = await db.execute(
        select(Category).offset(skip).limit(limit).order_by(Category.name)
    )
    items = result.scalars().all()
    data = [CategoryRead.model_validate(c) for c in items]
    await cache_set(cache_key_val, [c.model_dump() for c in data])
    return data


@router.post("", response_model=CategoryRead)
async def create_category(
    payload: CategoryCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a category."""
    cat = Category(**payload.model_dump())
    db.add(cat)
    await db.flush()
    await db.refresh(cat)
    return CategoryRead.model_validate(cat)


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(
    category_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a category by ID."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    cat = result.scalar_one_or_none()
    if not cat:
        from fastapi import HTTPException
        raise HTTPException(404, "Category not found")
    return CategoryRead.model_validate(cat)
