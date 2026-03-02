"""Category schemas."""

from app.schemas.common import BaseSchema


class CategoryRead(BaseSchema):
    id: int
    name: str
    slug: str
    description: str | None
    parent_id: int | None


class CategoryCreate(BaseSchema):
    name: str
    slug: str
    description: str | None = None
    parent_id: int | None = None
