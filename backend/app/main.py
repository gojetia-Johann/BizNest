"""BizNest FastAPI application."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import init_db
from app.api import services, businesses, products, search, categories


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    await init_db()
    yield
    # Close Redis connection
    from app.cache import get_redis
    try:
        r = await get_redis()
        await r.aclose()
    except Exception:
        pass


app = FastAPI(
    title="BizNest API",
    description="All-in-one platform for services, shops, and products",
    version="0.1.0",
    lifespan=lifespan,
)

settings = get_settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(categories.router, prefix="/api/v1/categories", tags=["Categories"])
app.include_router(services.router, prefix="/api/v1/services", tags=["Services"])
app.include_router(businesses.router, prefix="/api/v1/businesses", tags=["Businesses"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])


@app.get("/")
async def root():
    return {
        "name": "BizNest API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
