#!/bin/bash
set -e

# Prepare local run: Build packages for running strategies locally

echo "Starting local run preparation..."

echo "Building database package..."
pnpm --filter @ganaka/db build

echo "Building schemas package..."
pnpm --filter @ganaka/schemas build

echo "Building SDK package..."
pnpm --filter @ganaka/sdk build

echo "Local run preparation complete!"
