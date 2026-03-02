"""Unified search API with PostGIS near-me support."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Business, ServiceProvider, Service, Product
from app.cache import cache_get, cache_set, cache_key
from geoalchemy2 import WKTElement
from geoalchemy2.functions import ST_DWithin
from pydantic import BaseModel

router = APIRouter()

# Distance in meters for "near me" (default ~25km)
DEFAULT_RADIUS_M = 25_000


class SearchResultItem(BaseModel):
    type: str  # "business" | "service" | "product" | "provider"
    id: int
    name: str
    slug: str
    description: str | None = None
    category: str | None = None
    city: str | None = None
    rating: float | None = None
    image_url: str | None = None
    price: float | None = None
    price_unit: str | None = None


@router.get("", response_model=list[SearchResultItem])
async def search(
    q: str = Query(..., min_length=1),
    db: AsyncSession = Depends(get_db),
    lat: float | None = Query(None, description="Latitude for 'near me'"),
    lon: float | None = Query(None, description="Longitude for 'near me'"),
    radius_m: int = Query(DEFAULT_RADIUS_M, ge=100, le=100_000),
    limit: int = Query(20, ge=1, le=50),
    types: str | None = Query(
        None,
        description="Filter: businesses,services,products,providers (comma-separated)",
    ),
):
    """
    Unified search across businesses, services, products, and providers.
    Use lat/lon for location-based ranking ("electricians near me").
    """
    allowed_types = None
    if types:
        allowed_types = {t.strip().lower() for t in types.split(",")}

    cache_key_val = cache_key("search", q, lat or 0, lon or 0, radius_m, limit, types or "")
    cached = await cache_get(cache_key_val)
    if cached:
        return cached

    pattern = f"%{q}%"
    results: list[SearchResultItem] = []

    # Businesses
    if not allowed_types or "businesses" in allowed_types:
        biz_q = (
            select(Business)
            .where(Business.is_active == True)
            .where(
                or_(
                    Business.name.ilike(pattern),
                    Business.description.ilike(pattern),
                )
            )
            .options(selectinload(Business.category))
            .limit(limit)
        )
        if lat is not None and lon is not None:
            point = WKTElement(f"POINT({lon} {lat})", srid=4326)
            biz_q = biz_q.where(ST_DWithin(Business.location, point, radius_m))
        biz_result = await db.execute(biz_q)
        for b in biz_result.scalars().all():
            cat_name = b.category.name if b.category else None
            results.append(
                SearchResultItem(
                    type="business",
                    id=b.id,
                    name=b.name,
                    slug=b.slug,
                    description=b.description,
                    category=cat_name,
                    city=b.city,
                    rating=b.rating,
                    image_url=b.logo_url,
                )
            )

    # Services
    if not allowed_types or "services" in allowed_types:
        svc_q = (
            select(Service)
            .join(ServiceProvider)
            .where(Service.is_active == True)
            .where(
                or_(
                    Service.name.ilike(pattern),
                    Service.description.ilike(pattern),
                )
            )
            .options(selectinload(Service.provider), selectinload(Service.category))
            .limit(limit)
        )
        if lat is not None and lon is not None:
            point = WKTElement(f"POINT({lon} {lat})", srid=4326)
            svc_q = svc_q.where(ST_DWithin(ServiceProvider.location, point, radius_m))
        svc_result = await db.execute(svc_q)
        for s in svc_result.scalars().unique().all():
            cat_name = s.category.name if s.category else None
            results.append(
                SearchResultItem(
                    type="service",
                    id=s.id,
                    name=s.name,
                    slug=s.slug,
                    description=s.description,
                    category=cat_name,
                    rating=s.provider.rating if s.provider else None,
                    price=s.price_min or s.price_max,
                    price_unit=s.price_unit,
                )
            )

    # Products
    if not allowed_types or "products" in allowed_types:
        prod_q = (
            select(Product)
            .where(Product.is_available == True)
            .where(
                or_(
                    Product.name.ilike(pattern),
                    Product.description.ilike(pattern),
                )
            )
            .options(selectinload(Product.category))
            .limit(limit)
        )
        prod_result = await db.execute(prod_q)
        for p in prod_result.scalars().all():
            cat_name = p.category.name if p.category else None
            results.append(
                SearchResultItem(
                    type="product",
                    id=p.id,
                    name=p.name,
                    slug=p.slug,
                    description=p.description,
                    category=cat_name,
                    price=p.price,
                    image_url=p.image_url,
                )
            )

    # Providers
    if not allowed_types or "providers" in allowed_types:
        prov_q = (
            select(ServiceProvider)
            .where(ServiceProvider.is_active == True)
            .where(
                or_(
                    ServiceProvider.name.ilike(pattern),
                    ServiceProvider.bio.ilike(pattern),
                )
            )
            .limit(limit)
        )
        if lat is not None and lon is not None:
            point = WKTElement(f"POINT({lon} {lat})", srid=4326)
            prov_q = prov_q.where(ST_DWithin(ServiceProvider.location, point, radius_m))
        prov_result = await db.execute(prov_q)
        for p in prov_result.scalars().all():
            results.append(
                SearchResultItem(
                    type="provider",
                    id=p.id,
                    name=p.name,
                    slug=p.slug,
                    description=p.bio,
                    rating=p.rating,
                    image_url=p.avatar_url,
                )
            )

    # Dedupe and limit
    seen = set()
    unique_results = []
    for r in results:
        key = (r.type, r.id)
        if key not in seen:
            seen.add(key)
            unique_results.append(r)
        if len(unique_results) >= limit:
            break

    data = [r.model_dump() for r in unique_results]
    await cache_set(cache_key_val, data)
    return unique_results


@router.get("/near-me")
async def search_near_me(
    lat: float = Query(...),
    lon: float = Query(...),
    service_type: str = Query(..., description="e.g. electrician, plumber"),
    db: AsyncSession = Depends(get_db),
    radius_m: int = Query(25_000, ge=1000, le=100_000),
    limit: int = Query(10, ge=1, le=50),
):
    """
    Find service providers and businesses near a location.
    Example: GET /search/near-me?lat=40.7128&lon=-74.0060&service_type=electrician
    """
    pattern = f"%{service_type}%"
    point = WKTElement(f"POINT({lon} {lat})", srid=4326)

    # Services matching the type, with provider location
    q = (
        select(ServiceProvider)
        .join(Service)
        .where(ServiceProvider.is_active == True)
        .where(Service.is_active == True)
        .where(
            or_(
                Service.name.ilike(pattern),
                Service.description.ilike(pattern),
            )
        )
        .where(ServiceProvider.location.isnot(None))
        .where(ST_DWithin(ServiceProvider.location, point, radius_m))
        .options(selectinload(ServiceProvider.services))
        .limit(limit)
    )
    result = await db.execute(q)
    providers = result.scalars().unique().all()

    return [
        {
            "id": p.id,
            "name": p.name,
            "slug": p.slug,
            "rating": p.rating,
            "services": [{"name": s.name, "price": s.price_min or s.price_max} for s in p.services],
        }
        for p in providers
    ]
