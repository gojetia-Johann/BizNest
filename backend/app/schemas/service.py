"""Service and service provider schemas."""

from app.schemas.common import BaseSchema, LatLon


class ServiceRead(BaseSchema):
    id: int
    provider_id: int
    category_id: int | None
    name: str
    slug: str
    description: str | None
    price_min: float | None
    price_max: float | None
    price_unit: str | None
    is_active: bool


class ServiceCreate(BaseSchema):
    provider_id: int
    category_id: int | None = None
    name: str
    slug: str
    description: str | None = None
    price_min: float | None = None
    price_max: float | None = None
    price_unit: str | None = None


class ServiceProviderRead(BaseSchema):
    id: int
    name: str
    slug: str
    bio: str | None
    business_id: int | None
    phone: str | None
    email: str | None
    is_active: bool
    rating: float | None
    avatar_url: str | None


class ServiceProviderCreate(BaseSchema):
    name: str
    slug: str
    bio: str | None = None
    business_id: int | None = None
    phone: str | None = None
    email: str | None = None
    avatar_url: str | None = None
    location: LatLon | None = None


class ServiceProviderList(BaseSchema):
    id: int
    name: str
    slug: str
    rating: float | None
    avatar_url: str | None
