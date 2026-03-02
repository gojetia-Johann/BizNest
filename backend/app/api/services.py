"""Services and service providers API."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import ServiceProvider, Service
from app.schemas.service import (
    ServiceRead,
    ServiceCreate,
    ServiceProviderRead,
    ServiceProviderCreate,
    ServiceProviderList,
)
from app.cache import cache_get, cache_set, cache_key
from geoalchemy2 import WKTElement

router = APIRouter()


@router.get("/providers", response_model=list[ServiceProviderList])
async def list_providers(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category_id: int | None = Query(None),
):
    """List service providers."""
    cache_key_val = cache_key("providers", skip, limit, category_id or 0)
    cached = await cache_get(cache_key_val)
    if cached:
        return cached

    q = (
        select(ServiceProvider)
        .where(ServiceProvider.is_active == True)
        .options(selectinload(ServiceProvider.services))
    )
    if category_id:
        q = q.join(Service).where(Service.category_id == category_id)
    q = q.offset(skip).limit(limit).order_by(ServiceProvider.name).distinct()
    result = await db.execute(q)
    items = result.scalars().unique().all()
    data = [ServiceProviderList.model_validate(p) for p in items]
    await cache_set(cache_key_val, [c.model_dump() for c in data])
    return data


@router.post("/providers", response_model=ServiceProviderRead)
async def create_provider(
    payload: ServiceProviderCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a service provider."""
    d = payload.model_dump(exclude={"location"})
    loc = payload.location
    if loc:
        d["location"] = WKTElement(f"POINT({loc.lon} {loc.lat})", srid=4326)
    prov = ServiceProvider(**d)
    db.add(prov)
    await db.flush()
    await db.refresh(prov)
    return ServiceProviderRead.model_validate(prov)


@router.get("/providers/{provider_id}", response_model=ServiceProviderRead)
async def get_provider(
    provider_id: int,
    db: AsyncSession = Depends(get_db),
):
    """Get a service provider by ID."""
    result = await db.execute(
        select(ServiceProvider).where(ServiceProvider.id == provider_id)
    )
    prov = result.scalar_one_or_none()
    if not prov:
        from fastapi import HTTPException
        raise HTTPException(404, "Provider not found")
    return ServiceProviderRead.model_validate(prov)


@router.get("", response_model=list[ServiceRead])
async def list_services(
    db: AsyncSession = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    provider_id: int | None = Query(None),
    category_id: int | None = Query(None),
):
    """List services with optional filters."""
    cache_key_val = cache_key("services", skip, limit, provider_id or 0, category_id or 0)
    cached = await cache_get(cache_key_val)
    if cached:
        return cached

    q = select(Service).where(Service.is_active == True)
    if provider_id:
        q = q.where(Service.provider_id == provider_id)
    if category_id:
        q = q.where(Service.category_id == category_id)
    q = q.offset(skip).limit(limit).order_by(Service.name)
    result = await db.execute(q)
    items = result.scalars().all()
    data = [ServiceRead.model_validate(s) for s in items]
    await cache_set(cache_key_val, [c.model_dump() for c in data])
    return data


@router.post("", response_model=ServiceRead)
async def create_service(
    payload: ServiceCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a service."""
    svc = Service(**payload.model_dump())
    db.add(svc)
    await db.flush()
    await db.refresh(svc)
    return ServiceRead.model_validate(svc)
