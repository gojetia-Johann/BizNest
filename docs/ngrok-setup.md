# Exposing BizNest to the Internet with ngrok

Use ngrok to share your locally running BizNest stack with anyone on the internet — no router config, no cloud server required.

---

## Prerequisites

- Docker containers running (`docker compose up -d`)
- [ngrok account](https://dashboard.ngrok.com/signup) (free)

---

## Step 1 — Install ngrok

**Option A — winget (recommended on Windows)**
```powershell
winget install ngrok
```

**Option B — Manual**

Download the Windows ZIP from [ngrok.com/download](https://ngrok.com/download), extract, and add the folder to your system PATH.

Verify installation:
```powershell
ngrok version
```

---

## Step 2 — Authenticate (one-time setup)

1. Log in to [dashboard.ngrok.com](https://dashboard.ngrok.com)
2. Go to **Your Authtoken** in the left sidebar
3. Copy your token and run:

```powershell
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

This saves the token to `%USERPROFILE%\.ngrok2\ngrok.yml` — you only do this once per machine.

---

## Step 3 — Start your Docker stack

```powershell
cd C:\Users\JuanderFool-Life\Documents\Baseline\BizNest
docker compose up -d
```

Confirm all containers are healthy:
```powershell
docker compose ps
```

All 5 services (`postgres`, `redis`, `api`, `web`, `nginx`) should show **running**.

---

## Step 4 — Start the ngrok tunnel

Expose port **80** (Nginx, which routes to both the frontend and API):

```powershell
ngrok http 80
```

You will see output like:
```
Session Status    online
Account           your@email.com (Plan: Free)
Forwarding        https://abc123.ngrok-free.app -> http://localhost:80
Web Interface     http://127.0.0.1:4040
```

> **Keep this terminal open.** Closing it kills the tunnel.

---

## Step 5 — Update CORS in docker-compose.yml

The backend needs to allow requests coming from your ngrok URL.

Open `docker-compose.yml` and update the `CORS_ORIGINS` line under the `api` service:

```yaml
CORS_ORIGINS: http://localhost:3000,http://127.0.0.1:3000,https://abc123.ngrok-free.app
```

Replace `abc123.ngrok-free.app` with your actual ngrok URL.

Then rebuild and restart the API container:

```powershell
docker compose up -d --build api
```

---

## Step 6 — Share the URLs

| Page | URL |
|------|-----|
| Frontend (home) | `https://abc123.ngrok-free.app` |
| Businesses | `https://abc123.ngrok-free.app/businesses` |
| Services | `https://abc123.ngrok-free.app/services` |
| Products | `https://abc123.ngrok-free.app/products` |
| Near Me | `https://abc123.ngrok-free.app/near-me` |
| Sign Up | `https://abc123.ngrok-free.app/signup` |
| **Swagger UI** | `https://abc123.ngrok-free.app/api/v1/docs` |
| **ReDoc** | `https://abc123.ngrok-free.app/api/v1/redoc` |
| **API base** | `https://abc123.ngrok-free.app/api/v1` |
| ngrok dashboard | `http://localhost:4040` *(local only)* |

---

## Inspecting Traffic (optional)

ngrok provides a real-time request inspector at:
```
http://localhost:4040
```

Here you can see every HTTP request made through the tunnel — method, headers, body, response status — very useful for debugging API calls from external devices.

---

## Getting a Permanent URL (optional)

On the free plan, ngrok generates a **random URL every time** you restart the tunnel. To get a fixed URL:

### Option A — Free static domain (1 per free account)
1. Go to [dashboard.ngrok.com/cloud-edge/domains](https://dashboard.ngrok.com/cloud-edge/domains)
2. Click **New Domain** → ngrok gives you a free static subdomain
3. Use it:
   ```powershell
   ngrok http --domain=your-static-name.ngrok-free.app 80
   ```

### Option B — Paid plan
Paid plans allow custom domains (e.g. `biznest.yourdomain.com`).

---

## Stopping the Tunnel

Simply press `Ctrl + C` in the ngrok terminal. Your Docker containers keep running — only the public tunnel is closed.

To stop everything:
```powershell
docker compose down
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ngrok: command not found` | Re-install or add ngrok to your PATH |
| Tunnel connects but site won't load | Make sure `docker compose ps` shows all containers running |
| API calls fail (CORS error) | Add your ngrok URL to `CORS_ORIGINS` in `docker-compose.yml` and run `docker compose up -d --build api` |
| ngrok shows `ERR_NGROK_3200` | Your authtoken is missing — run Step 2 again |
| URL changed after restart | Use a static domain (see above) or update `CORS_ORIGINS` each time |
| Port 80 already in use | Stop whatever is using port 80, or change Nginx to another port in `docker-compose.yml` |
