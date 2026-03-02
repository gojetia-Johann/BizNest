"""Businesses API."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import Business
from app.schemas.business import BusinessRead, BusinessList, BusinessCreate
from app.cache import cache_get, cache_set, cache_key
from geoalchemy2 import WKTElement

router = APIRouter()


def _business_to_read(b: Business) -> dict:
    return BusinessRead(
        id=b.id,
        name=b.name,
        slug=b.slug,
        description=b.description,
        category_id=b.category_id,
        address=b.address,
        city=b.city,
        region=b.region,
        postal_code=b.postal_code,
        country=b.country,
        phone=b.phone,
        email=b.email,
        website=b.website,
        is_active=b.is_active,
        rating=b.rating,
        logo_url=b.logo_url,
    ).model_dump()


@router.get("", response_model=list[BusinessList])
async def list_businesses(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    city: str | None = Query(None),
    category_id: int | None = Query(None),
):
    """List businesses with optional filters."""
    cache_key_val = cache_key("businesses", skip, limit, city or "", category_id or 0)
    cached = await cache_get(cache_key_val)
    if cached:
        return cached

    q = select(Business).where(Business.is_active == True)
    if city:
        q = q.where(Business.city.ilike(f"%{city}%"))
    if category_id:
        q = q.where(Business.category_id == category_id)
    q = q.offset(skip).limit(limit).order_by(Business.name)
    result = await db.execute(q)
    items = result.scalars().all()
    data = [BusinessList.model_validate(b) for b in items]
    await cache_set(cache_key_val, [c.model_dump() for c in data])
    return data


@router.post("", response_model=BusinessRead)
async def create_business(
    payload: BusinessCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a business."""
    d = payload.model_dump(exclude={"location"})
    loc = payload.location
    if loc:
        d["location"] = WKTElement(f"POINT({loc.lon} {loc.lat})", srid=4326)
    biz = Business(**d)
    db.add(biz)
    await db.flush()
    await db.refresh(biz)
    return BusinessRead.model_validate(biz)


@router.get("/{business_id}", response_model=BusinessRead)
async def get_business(
    business_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a business by ID."""
    result = await db.execute(select(Business).where(Business.id == business_id))
    biz = result.scalar_one_or_none()
    if not biz:
        from fastapi import HTTPException
        raise HTTPException(404, "Business not found")
    return BusinessRead.model_validate(biz)
