/**
 * Script to handle npm installation for Cloudflare Pages
 * This script will install dependencies using npm with the correct flags
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
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

// Main function
async function main() {
  console.log('Starting npm installation for Cloudflare Pages...');
  
  // Install dependencies
  if (!runCommand('npm install --legacy-peer-deps --no-audit')) {
    console.error('Failed to install dependencies with npm');
    process.exit(1);
  }
  
  // Install @cloudflare/next-on-pages
  if (!runCommand('npm install --save-dev @cloudflare/next-on-pages')) {
    console.error('Failed to install @cloudflare/next-on-pages');
    process.exit(1);
  }
  
  // Build the application
  if (!runCommand('npx @cloudflare/next-on-pages')) {
    console.error('Failed to build the application');
    process.exit(1);
  }
  
  console.log('Installation and build completed successfully!');
}

// Run the main function
main().catch(error => {
  console.error('Installation failed:', error);
  process.exit(1);
});
