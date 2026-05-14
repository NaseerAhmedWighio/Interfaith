# ============================================================
# Interfaith Peace Bridge - Dockerfile
# ============================================================

# ---------- Base Stage ----------
FROM node:20-bookworm-slim AS base

WORKDIR /app

RUN apt-get update -y && \
    apt-get install -y openssl --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./

RUN npm ci

COPY prisma/ prisma/
RUN npx prisma generate

# ---------- Migrate Stage ----------
FROM base AS migrate

RUN apt-get update -y && \
    apt-get install -y postgresql-client --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY data/migrations/ /app/data/migrations/

# ---------- Builder Stage ----------
FROM base AS builder

ENV DOCKER_BUILD=true

COPY tsconfig.json next.config.js postcss.config.js tailwind.config.js eslint.config.js ./
COPY public/ public/
COPY src/ src/

RUN npm run build

# ---------- Runner Stage ----------
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update -y && \
    apt-get install -y openssl wget --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN mkdir -p /app/public/uploads/profiles && chown -R node:node /app/public/uploads

EXPOSE 3060

CMD ["node", "server.js"]
