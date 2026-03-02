# BizNest — All-in-One Marketplace Platform

A full-stack marketplace connecting **consumers** with **service providers**, local shops, and businesses of all sizes. Find electricians, printing shops, salons, hardware stores, restaurants, and thousands more — all in one place. Built with a **FastAPI** backend and a **Next.js 16** frontend, fully containerised with Docker.

---

## Features

- **Service Provider Directory** — Find verified professionals (repairs, beauty, trades, consulting, and more)
- **Business & Shop Listings** — Discover small to large businesses, filtered by category and city
- **Product Catalog** — Browse goods sold by listed stores
- **Unified Search** — One search bar across services, businesses, and products
- **Location-Based Search** — "Near me" queries powered by **PostGIS** geospatial indexing
- **Smart Caching** — **Redis** read-through cache for high-traffic queries
- **AI-Ready Architecture** — Backend stubs and async patterns ready for ML/AI integration (recommendations, chatbots, smart search)
- **Modern UI** — Responsive Next.js frontend with vivid category grids, profile-style service cards, and gradient page headers

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | **Next.js 16** (App Router, TypeScript), React 18, Tailwind CSS |
| Backend | **Python 3.11+**, **FastAPI** (async), Pydantic v2 |
| Database | **PostgreSQL 16** + **PostGIS 3.4** |
| Cache | **Redis 7** |
| ORM / Migrations | **SQLAlchemy 2.0** (async), **Alembic** |
| Infrastructure | **Docker**, **Docker Compose**, **Nginx** (reverse proxy) |
| Deployment | AWS / GCP / DigitalOcean; frontend deployable to **Vercel** |

---

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)

### Run the Full Stack

```bash
# Clone and enter the project
cd BizNest

# Start all services: postgres, redis, api, web (Next.js), nginx
docker compose up -d --build

# (First run) Apply database migrations
docker compose exec api alembic upgrade head

# (Optional) Seed sample data
docker compose exec api python scripts/seed_data.py
```

| URL | Description |
|-----|-------------|
| `http://localhost` | Frontend (via Nginx) |
| `http://localhost:3000` | Frontend (direct) |
| `http://localhost/api/v1/docs` | Swagger UI |
| `http://localhost/api/v1/redoc` | ReDoc |
| `http://localhost:8000/docs` | Swagger (API direct) |

---

## Local Development

### Backend only

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # edit DATABASE_URL, REDIS_URL, etc.

# Spin up just the DB and Redis
docker compose up -d postgres redis

uvicorn app.main:app --reload
```

### Frontend only

```bash
cd frontend
cp .env.example .env.local      # set NEXT_PUBLIC_API_URL if needed
npm install
npm run dev                     # http://localhost:3000
```

The frontend defaults `NEXT_PUBLIC_API_URL` to `http://localhost/api/v1` (via Nginx). For standalone local dev set it to `http://localhost:8000/api/v1`.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/search?q=` | Unified search — optional `lat`, `lon`, `radius_m`, `types` |
| `GET` | `/api/v1/search/near-me?lat=&lon=&service_type=` | Location-based service search |
| `GET/POST` | `/api/v1/categories` | List / create categories |
| `GET/POST` | `/api/v1/businesses` | List / create businesses |
| `GET` | `/api/v1/businesses/{id}` | Business detail |
| `GET/POST` | `/api/v1/services/providers` | List / create service providers |
| `GET` | `/api/v1/services/providers/{id}` | Provider detail |
| `GET/POST` | `/api/v1/services` | List / create services |
| `GET/POST` | `/api/v1/products` | List / create products |
| `GET` | `/api/v1/products/{id}` | Product detail |

Full interactive docs: `http://localhost/api/v1/docs`

---

## Project Structure

```
BizNest/
├── backend/
│   ├── app/
│   │   ├── api/            # Route handlers (search, businesses, services, products, categories)
│   │   ├── models/         # SQLAlchemy + PostGIS models
│   │   ├── schemas/        # Pydantic v2 schemas (Read / List / Create)
│   │   ├── cache.py        # Redis read-through helpers
│   │   ├── config.py       # Settings (pydantic-settings)
│   │   ├── database.py     # Async engine + session factory
│   │   └── main.py         # App factory, CORS, startup
│   ├── alembic/            # Database migrations
│   ├── scripts/            # Seed data scripts
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── app/                # Next.js App Router pages
│   │   ├── page.tsx                    # Home
│   │   ├── businesses/                 # Business listing + detail
│   │   ├── services/                   # Service provider listing + detail
│   │   ├── products/                   # Product listing + detail
│   │   ├── categories/                 # Category browser
│   │   ├── search/                     # Unified search results
│   │   ├── near-me/                    # Location-based search
│   │   └── list-your-business/         # Onboarding landing page
│   ├── components/
│   │   ├── cards/          # BusinessCard, ServiceProviderCard, ProductCard
│   │   ├── home/           # HeroSection, CategoryGrid, FeaturedSection, HowItWorks, CtaBanner
│   │   ├── layout/         # Header, Footer
│   │   └── ui/             # Avatar, Badge, Skeleton, StarRating, EmptyState
│   ├── lib/
│   │   ├── api.ts          # Typed API client
│   │   ├── types.ts        # TypeScript interfaces matching backend schemas
│   │   ├── hooks.ts        # useApi, useDebounce
│   │   └── utils.ts        # cn, formatPrice, formatRating, truncate
│   ├── public/
│   ├── .env.example
│   └── Dockerfile          # Multi-stage build (deps → builder → runner)
├── nginx/                  # Nginx reverse-proxy config
├── docker-compose.yml      # postgres, redis, api, web, nginx
└── README.md
```

---

## Environment Variables

### Backend (`backend/.env.example`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Async PostgreSQL URL (`postgresql+asyncpg://...`) |
| `DATABASE_SYNC_URL` | Sync URL for Alembic migrations |
| `REDIS_URL` | Redis connection URL |
| `CORS_ORIGINS` | Comma-separated list of allowed origins |
| `SECRET_KEY` | App secret key |

### Frontend (`frontend/.env.example`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `http://localhost/api/v1`) |

---

## Deployment

- **Backend**: Build the `api` Docker image and run alongside `postgres` and `redis`. Use Nginx in front of the API. Managed databases (AWS RDS + ElastiCache) are drop-in replacements.
- **Frontend**: Build the `web` Docker image (standalone output) or deploy the `frontend/` directory to **Vercel**. Set `NEXT_PUBLIC_API_URL` to your production API URL and add the frontend origin to `CORS_ORIGINS`.

---

## Roadmap

- [ ] Authentication (JWT / OAuth2)
- [ ] Business owner dashboard
- [ ] Reviews & ratings system
- [ ] AI-powered recommendations
- [ ] In-app messaging / booking
- [ ] Mobile app (React Native)

---

## License

MIT
