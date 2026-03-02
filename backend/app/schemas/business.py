"""Business schemas."""

from app.schemas.common import BaseSchema
from app.schemas.common import LatLon


class BusinessRead(BaseSchema):
    id: int
    name: str
    slug: str
    description: str | None
    category_id: int | None
    address: str | None
    city: str | None
    region: str | None
    postal_code: str | None
    country: str
    phone: str | None
    email: str | None
    website: str | None
    is_active: bool
    rating: float | None
    logo_url: str | None


class BusinessCreate(BaseSchema):
    name: str
    slug: str
    description: str | None = None
    category_id: int | None = None
    address: str | None = None
    city: str | None = None
    region: str | None = None
    postal_code: str | None = None
    country: str = "US"
    phone: str | None = None
    email: str | None = None
    website: str | None = None
    logo_url: str | None = None
    location: LatLon | None = None


class BusinessList(BaseSchema):
    id: int
    name: str
    slug: str
    city: str | None
    rating: float | None
    logo_url: str | None
