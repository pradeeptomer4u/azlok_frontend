#!/bin/bash

# Deployment script for Cloudflare Pages

# Set error handling
set -e

# Configuration
PROJECT_NAME="azlok"
BUILD_DIR=".vercel/output/static"
PREPARE_SCRIPT="cloudflare:build"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print header
echo -e "${GREEN}=== Azlok Cloudflare Pages Deployment ===${NC}"
echo "Starting deployment process..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}Wrangler not found. Installing...${NC}"
    npm install -g wrangler
fi

# Run the build script
echo -e "${GREEN}Building the application...${NC}"
npm run $PREPARE_SCRIPT

# Check if build was successful
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${RED}Build failed! Directory $BUILD_DIR not found.${NC}"
    exit 1
fi

# Deploy to Cloudflare Pages
echo -e "${GREEN}Deploying to Cloudflare Pages...${NC}"
wrangler pages deploy $BUILD_DIR --project-name=$PROJECT_NAME

echo -e "${GREEN}Deployment complete!${NC}"
