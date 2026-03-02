"""Common schemas."""

from pydantic import BaseModel, ConfigDict


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class LatLon(BaseModel):
    lat: float
    lon: float


class PaginatedResponse(BaseModel):
    total: int
    page: int
    per_page: int
    items: list
