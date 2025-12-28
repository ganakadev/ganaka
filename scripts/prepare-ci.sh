#!/bin/bash
set -e

# Prepare release: Deploy migrations, generate Prisma client, and build packages

echo "Starting CI preparation..."

echo "Generating Prisma client..."
pnpm --filter @ganaka/db prisma:generate

echo "Building database package..."
pnpm --filter @ganaka/db build

echo "Building schemas package..."
pnpm --filter @ganaka/schemas build

echo "Building SDK package..."
pnpm --filter @ganaka/sdk build

echo "Building client package..."
pnpm --filter @ganaka/client build

echo "Building server package..."
pnpm --filter @ganaka/server build

echo "Building collector package..."
pnpm --filter @ganaka/collector build

echo "CI preparation complete!"
