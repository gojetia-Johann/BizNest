"""Seed sample data for development."""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import engine, Base
from app.config import get_settings

# Use sync URL for raw SQL (PostGIS)
settings = get_settings()


async def seed():
    from app.database import AsyncSessionLocal, init_db
    from app.models import Category, Business, ServiceProvider, Service, Product
    from geoalchemy2 import WKTElement

    await init_db()

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        from sqlalchemy import select
        r = await db.execute(select(Category).limit(1))
        if r.scalar_one_or_none():
            print("Data already seeded. Skipping.")
            return

        # Categories
        cats = [
            Category(name="Home Services", slug="home-services", description="Plumbing, electrical, repairs"),
            Category(name="Beauty & Wellness", slug="beauty-wellness", description="Hair, spa, fitness"),
            Category(name="Professional Services", slug="professional", description="Legal, consulting, accounting"),
            Category(name="Retail", slug="retail", description="Goods and products"),
        ]
        for c in cats:
            db.add(c)
        await db.flush()

        # Businesses
        biz1 = Business(
            name="Joe's Hardware",
            slug="joes-hardware",
            description="Local hardware store",
            category_id=cats[3].id,
            city="Brooklyn",
            region="NY",
            country="US",
            address="123 Main St",
            location=WKTElement("POINT(-73.99 40.71)", srid=4326),
        )
        biz2 = Business(
            name="Spark Electric",
            slug="spark-electric",
            description="Licensed electricians",
            category_id=cats[0].id,
            city="Manhattan",
            region="NY",
            country="US",
            address="456 5th Ave",
            location=WKTElement("POINT(-73.98 40.75)", srid=4326),
        )
        db.add_all([biz1, biz2])
        await db.flush()

        # Service providers
        prov = ServiceProvider(
            name="Mike the Electrician",
            slug="mike-electrician",
            bio="10 years experience, licensed",
            business_id=biz2.id,
            location=WKTElement("POINT(-73.98 40.75)", srid=4326),
        )
        db.add(prov)
        await db.flush()

        # Services
        svc = Service(
            provider_id=prov.id,
            category_id=cats[0].id,
            name="Electrical Wiring",
            slug="electrical-wiring",
            description="Residential and commercial wiring",
            price_min=100,
            price_max=500,
            price_unit="per job",
        )
        db.add(svc)
        await db.flush()

        # Products
        prod = Product(
            business_id=biz1.id,
            category_id=cats[3].id,
            name="Power Drill",
            slug="power-drill",
            description="18V cordless drill",
            price=89.99,
        )
        db.add(prod)

        await db.commit()
        print("Seed data created successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
