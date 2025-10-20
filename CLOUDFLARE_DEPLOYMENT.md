# Cloudflare Pages Deployment Guide

This document provides instructions for deploying the Azlok e-commerce platform to Cloudflare Pages.

## Prerequisites

- Node.js v20.19.5 or later
- Cloudflare account with Pages enabled
- Wrangler CLI installed (`npm install -g wrangler`)

## Configuration Files

The following configuration files have been set up for Cloudflare Pages deployment:

### wrangler.toml

```toml
name = "next-on-cloudflare"
compatibility_date = "2024-07-29"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = ".vercel/output/static"

# Necessary for Cloudflare Pages to recognize Node.js compatibility
[build.environment]
NODE_VERSION = "20.19.5"

[build]
command = "npm run pages:build"

[site]
wrangler_config_path = "wrangler.toml"
```

### cloudflare.toml

```toml
# Cloudflare Pages configuration

[build]
command = "npm run cloudflare:build"
publish = ".vercel/output/static"

[build.environment]
NODE_VERSION = "20.19.5"
NPM_FLAGS = "--legacy-peer-deps"

[compatibility]
nodejs_compat = true
```

### .yarnrc.yml

```yaml
nodeLinker: node-modules
enableGlobalCache: true

logFilters:
  - code: YN0002
    level: discard
  - code: YN0060
    level: discard
  - code: YN0086
    level: discard

nmMode: hardlinks-local

# Allow modifications to the lockfile during CI builds
enableImmutableInstalls: false

# Prevent peer dependency warnings
enableStrictPeerDependencies: false
```

### .npmrc

```
legacy-peer-deps=true
strict-peer-dependencies=false
auto-install-peers=true
node-linker=hoisted
```

## Deployment Options

### Option 1: Using the Cloudflare Dashboard

1. Log in to your Cloudflare account
2. Go to Pages > Create a project > Connect to Git
3. Select your repository and configure the following settings:
   - Build command: `npm run cloudflare:build`
   - Build output directory: `.vercel/output/static`
   - Environment variables:
     - NODE_VERSION: 20.19.5
     - NPM_FLAGS: --legacy-peer-deps

### Option 2: Using the Deployment Script

1. Make the deployment script executable:
   ```bash
   chmod +x deploy-to-cloudflare.sh
   ```

2. Run the deployment script:
   ```bash
   ./deploy-to-cloudflare.sh
   ```

### Option 3: Using Wrangler CLI

1. Build the application:
   ```bash
   npm run cloudflare:build
   ```

2. Deploy to Cloudflare Pages:
   ```bash
   wrangler pages deploy .vercel/output/static --project-name=azlok
   ```

## Troubleshooting

### Yarn Dependency Resolution Issues

If you encounter "The lockfile would have been modified by this install, which is explicitly forbidden" errors:

1. Use npm instead of Yarn:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Or update the Yarn configuration:
   ```bash
   yarn install --mode=update-lockfile
   ```

### Large File Size Issues

If you encounter "Pages only supports files up to 25 MiB in size" errors:

1. Use the `pages:prepare` script which filters out large files:
   ```bash
   npm run pages:prepare
   ```

2. Deploy the prepared build:
   ```bash
   npm run deploy:pages
   ```

### Node.js Compatibility Issues

If you encounter "Node.JS Compatibility Error: no nodejs_compat compatibility flag set":

1. Ensure the `nodejs_compat` flag is set in all configuration files:
   - wrangler.toml
   - cloudflare.toml
   - public/_routes.json

2. Verify that the Node.js version is set correctly:
   ```bash
   cat .nvmrc
   ```

## Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/)
- [next-on-pages Documentation](https://github.com/cloudflare/next-on-pages)
