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

echo "CI preparation complete!"
