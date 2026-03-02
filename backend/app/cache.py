"""Redis cache utilities."""

import json
from typing import Any

import redis.asyncio as redis

from app.config import get_settings

_settings = get_settings()
_client: redis.Redis | None = None


async def get_redis() -> redis.Redis:
    """Get Redis client (singleton)."""
    global _client
    if _client is None:
        _client = redis.from_url(_settings.redis_url, decode_responses=True)
    return _client


async def cache_get(key: str) -> Any | None:
    """Get value from cache. Returns None if not found or on error."""
    try:
        r = await get_redis()
        val = await r.get(key)
        if val is None:
            return None
        return json.loads(val)
    except Exception:
        return None


async def cache_set(key: str, value: Any, ttl: int | None = None) -> bool:
    """Set value in cache. Returns True on success."""
    try:
        r = await get_redis()
        ttl = ttl or _settings.cache_ttl
        await r.setex(key, ttl, json.dumps(value, default=str))
        return True
    except Exception:
        return False


async def cache_delete(key: str) -> bool:
    """Delete key from cache."""
    try:
        r = await get_redis()
        await r.delete(key)
        return True
    except Exception:
        return False


def cache_key(prefix: str, *parts: str | int) -> str:
    """Build cache key from prefix and parts."""
    return f"biznest:{prefix}:{':'.join(str(p) for p in parts)}"
