#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until pg_isready -h db -p 5432 -U nikmohaseb 2>/dev/null; do
  sleep 1
done

echo "📦 Running migrations..."
npx prisma migrate deploy

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🌱 Running seed..."
npm run seed || echo "⚠️  Seed completed (may have duplicates)"

echo "🚀 Starting Next.js app..."
npx next start -p 3000
