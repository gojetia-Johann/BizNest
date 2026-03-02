# BizNest — All-in-One Platform for Services & Business

A comprehensive marketplace connecting **consumers** with **service providers**, **shops**, and **businesses**. Target users: individuals offering services, small to large businesses, and stores selling goods. Search for services (e.g. electricians, plumbers), discover local shops, and find products—all in one place.

## Features

- **Service Providers Directory** — List and find professionals (repairs, consulting, beauty, trades)
- **Business/Shop Listings** — Browse small to large businesses by category and location
- **Product Catalog** — Discover goods sold across listed stores
- **Unified Search** — One search across services, products, shops, and providers
- **Location-Based Search** — “Electricians near me” powered by **PostGIS**
- **Smart Caching** — **Redis** for heavy query performance
- **AI-Ready** — Python backend ready for ML integration (recommendations, search, chatbots)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11+, **FastAPI** (async) |
| Database | **PostgreSQL** + **PostGIS** (location) |
| Cache | **Redis** |
| Infrastructure | **Docker**, **Nginx** |
| Deploy | AWS / GCP / DigitalOcean; frontend can use Vercel (e.g. Next.js) |

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Python 3.11+ (for local backend dev)

### Run with Docker

```bash
cd BizNest

# Start PostgreSQL, Redis, API, Web, and Nginx
docker compose up -d

# Optional: apply Alembic migrations (for versioned schema)
docker compose exec api alembic upgrade head

# Optional: seed sample data
docker compose exec api python scripts/seed_data.py
```

- **Web app**: http://localhost  
- **API (direct)**: http://localhost:8000  
- **API docs (via nginx)**: http://localhost/docs  

### Local Development (backend only)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Start DB and Redis: docker compose up -d postgres redis
uvicorn app.main:app --reload
```

### Local Development (frontend only)

```bash
cd frontend
cp .env.example .env.local  # optional
npm install
npm run dev
```

## API Overview

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/search?q=...` | Unified search (optional `lat`, `lon`, `radius_m`, `types`) |
| `GET /api/v1/search/near-me?lat=&lon=&service_type=` | Location-based service search |
| `GET/POST /api/v1/categories` | Categories |
| `GET/POST /api/v1/services`, `/providers` | Services and service providers |
| `GET/POST /api/v1/businesses` | Businesses/shops |
| `GET/POST /api/v1/products` | Products |

## Project Structure

```
BizNest/
├── backend/             # FastAPI app
│   ├── app/
│   │   ├── api/         # Routes (search, services, businesses, products, categories)
│   │   ├── models/      # SQLAlchemy + PostGIS models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── cache.py     # Redis helpers
│   │   ├── config.py    # Settings
│   │   ├── database.py  # Async engine + session
│   │   └── main.py
│   ├── alembic/         # DB migrations
│   ├── scripts/         # e.g. seed_data.py
│   ├── requirements.txt
│   └── Dockerfile
├── nginx/               # Nginx config (reverse proxy)
├── docker-compose.yml   # postgres (PostGIS), redis, api, nginx
└── README.md
```

## Environment Variables

See `backend/.env.example`. Key variables: `DATABASE_URL`, `DATABASE_SYNC_URL`, `REDIS_URL`, `CORS_ORIGINS`, `SECRET_KEY`.

## Deployment

- **Backend**: Build the `api` image and run with `postgres` and `redis` (or use managed DB/Redis on AWS, GCP, or DigitalOcean). Use Nginx in front of the API.
- **Frontend**: Use Next.js or any SPA; deploy on Vercel or static hosting and set `CORS_ORIGINS` to your frontend origin.

## License

MIT
