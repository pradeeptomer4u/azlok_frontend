#!/bin/bash

# Script to handle dependency installation for Cloudflare Pages
# This script will use Node.js to run the npm-install.js script

set -e

echo "Starting dependency installation for Cloudflare Pages..."

# Use Node.js to run the npm-install.js script
echo "Running npm-install.js..."
node ./scripts/npm-install.js

echo "Installation and build completed successfully!"
