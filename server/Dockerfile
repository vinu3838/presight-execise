# ---- builder ----
FROM node:22-alpine AS builder

# better-sqlite3 compiles from source on Alpine (musl) — needs build tools
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json yarn.lock lerna.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN yarn install --frozen-lockfile

COPY server/src ./server/src
COPY server/tsconfig.json ./server/

RUN yarn workspace presight-server build

# ---- runner ----
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV DB_PATH=/data/users.db

# Copy compiled native modules (built for alpine in builder stage)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist

RUN mkdir -p /data

EXPOSE 3001

# Seed runs first (skipped if DB already has data), then server starts
CMD ["sh", "-c", "node server/dist/db/seed.js && node server/dist/index.js"]
