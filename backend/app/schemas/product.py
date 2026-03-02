"""Product schemas."""

from app.schemas.common import BaseSchema


class ProductRead(BaseSchema):
    id: int
    business_id: int
    category_id: int | None
    name: str
    slug: str
    description: str | None
    price: float | None
    currency: str
    image_url: str | None
    is_available: bool


class ProductCreate(BaseSchema):
    business_id: int
    category_id: int | None = None
    name: str
    slug: str
    description: str | None = None
    price: float | None = None
    currency: str = "USD"
    image_url: str | None = None


class ProductList(BaseSchema):
    id: int
    name: str
    slug: str
    price: float | None
    image_url: str | None
    business_id: int
