FROM ubuntu:24.04 AS base

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# Install Node.js 22
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

FROM base AS builder
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

# Download external images used in seed data so they work at runtime
# without internet access from the container
# (using local SVG fallbacks since container may lack internet at runtime)
RUN mkdir -p /app/public/images/articles

ENV DATABASE_URL="postgresql://placeholder:placeholder@db:5432/db"
RUN npx prisma generate --schema prisma/schema.prisma
RUN npm run build

FROM base AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    postgresql-client \
    wget \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules

# Install tsx for seed script (devDependency needed at runtime)
RUN npm install -g tsx

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/generated/prisma ./generated/prisma

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 3000
CMD ["sh", "./docker-entrypoint.sh"]
