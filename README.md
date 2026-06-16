# Presight Frontend Exercise

## Setup & Running

### Running with Docker Compose

From the project root:

```bash
docker compose up --build
```

This builds and starts two containers:
- `server` — Node API, listening on `http://localhost:3001`, backed by a named Docker volume (`sqlite_data`) so the SQLite file persists across restarts. The database is seeded automatically on first boot if empty.
- `client` — built React app served via nginx at `http://localhost:3000`, which also proxies `/users` requests to the `server` container.

Open `http://localhost:3000` once both containers report as running.

To stop and remove the containers:

```bash
docker compose down
```

Add `-v` to also remove the named volume (this deletes the seeded SQLite data, so the next `up` will reseed from scratch):

```bash
docker compose down -v
```

### Local development (without Docker)

1. Install dependencies (yarn workspaces — installs both `client` and `server`):

   ```bash
   yarn install
   ```

2. Create the SQLite schema:

   ```bash
   yarn workspace presight-server migrate
   ```

3. Seed the database with 500 sample users (skips automatically if data already exists):

   ```bash
   yarn workspace presight-server seed
   ```

4. Start both the client and server in dev mode (from the project root):

   ```bash
   yarn dev
   ```

   This runs `lerna run dev --parallel`, starting:
   - the API server at `http://localhost:3001`
   - the Vite dev server at `http://localhost:3000` (proxies `/users` to the API)

5. Open `http://localhost:3000` in your browser.

API docs (Swagger UI) are available at `http://localhost:3001/api-docs` while the server is running.
