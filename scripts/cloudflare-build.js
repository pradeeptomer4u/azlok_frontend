#!/usr/bin/env node

/**
 * Custom build script for Cloudflare Pages
 * This script handles dependency installation and build process
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const USE_NPM = true; // Set to false to use Yarn
const PROJECT_ROOT = process.cwd();

// Helper function to run commands
function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: PROJECT_ROOT
    });
    return true;
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    return false;
  }
}

// Main build process
async function main() {
  console.log('Starting Cloudflare Pages build process...');
  
  // Ensure Node.js compatibility flag is set
  console.log('Ensuring Node.js compatibility flag is set...');
  const wranglerPath = path.join(PROJECT_ROOT, 'wrangler.toml');
  
  if (fs.existsSync(wranglerPath)) {
    let wranglerContent = fs.readFileSync(wranglerPath, 'utf8');
    if (!wranglerContent.includes('nodejs_compat')) {
      console.log('Adding nodejs_compat flag to wrangler.toml...');
      wranglerContent = wranglerContent.replace(
        /compatibility_flags\s*=\s*\[(.*?)\]/,
        (match, p1) => {
          const flags = p1.split(',').map(f => f.trim());
          if (!flags.includes('"nodejs_compat"') && !flags.includes('\'nodejs_compat\'')) {
            flags.push('"nodejs_compat"');
          }
          return `compatibility_flags = [${flags.join(', ')}]`;
        }
      );
      fs.writeFileSync(wranglerPath, wranglerContent);
    }
  }
  
  // Install dependencies
  console.log('Installing dependencies...');
  
  if (USE_NPM) {
    // Using NPM
    if (!runCommand('npm install --legacy-peer-deps --no-audit')) {
      console.error('Failed to install dependencies with npm');
      process.exit(1);
    }
  } else {
    // Using Yarn
    if (!runCommand('yarn install --mode=update-lockfile')) {
      console.error('Failed to install dependencies with yarn');
      process.exit(1);
    }
  }
  
  // Build the application
  console.log('Building the application...');
  if (!runCommand('npm run pages:build')) {
    console.error('Failed to build the application');
    process.exit(1);
  }
  
  console.log('Build completed successfully!');
}

// Run the build process
main().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});
