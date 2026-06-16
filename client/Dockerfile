# ---- builder ----
FROM node:22-alpine AS builder

WORKDIR /app

# Copy workspace manifests first for better layer caching
COPY package.json yarn.lock lerna.json ./
COPY server/package.json ./server/
COPY client/package.json ./client/

# --ignore-scripts skips native module compilation (better-sqlite3 from server workspace)
# which the client build doesn't need
RUN yarn install --frozen-lockfile --ignore-scripts

COPY client/ ./client/

RUN yarn workspace presight-client build

# ---- runner ----
FROM nginx:alpine

COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
