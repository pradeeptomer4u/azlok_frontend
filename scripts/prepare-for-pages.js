/**
 * Script to prepare Next.js build output for Cloudflare Pages deployment
 * This script removes large files that exceed Cloudflare's 25 MiB size limit
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);
const copyFileAsync = promisify(fs.copyFile);
const mkdirAsync = promisify(fs.mkdir);
const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);
const unlinkAsync = promisify(fs.unlink);
const rmdirAsync = promisify(fs.rm);

// Configuration
const SOURCE_DIR = path.join(process.cwd(), '.next');
const PREPARED_DIR = path.join(process.cwd(), '.next-prepared');
const MAX_FILE_SIZE = 24 * 1024 * 1024; // 24 MiB (slightly under the 25 MiB limit)
const EXCLUDED_PATHS = [
  'cache',
  'server/chunks/font-manifest.json',
  'trace'
];

async function copyDirectory(source, destination, excludedPaths = []) {
  try {
    // Create destination directory if it doesn't exist
    await mkdirAsync(destination, { recursive: true });
    
    // Read source directory
    const entries = await readDirAsync(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(source, entry.name);
      const destPath = path.join(destination, entry.name);
      
      // Check if path should be excluded
      const relativePath = path.relative(SOURCE_DIR, srcPath);
      if (excludedPaths.some(excluded => relativePath.startsWith(excluded))) {
        continue;
      }
      
      if (entry.isDirectory()) {
        // Recursively copy subdirectories
        await copyDirectory(srcPath, destPath, excludedPaths);
      } else {
        // Check file size before copying
        const stats = await statAsync(srcPath);
        if (stats.size > MAX_FILE_SIZE) {
          continue;
        }
        
        // Copy file
        await copyFileAsync(srcPath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
    throw error;
  }
}

async function prepareForPages() {
  try {
    
    // Remove existing prepared directory if it exists
    try {
      await rmdirAsync(PREPARED_DIR, { recursive: true, force: true });
    } catch (error) {
      // Ignore if directory doesn't exist
    }
    
    // Copy .next directory to .next-prepared, excluding large files
    await copyDirectory(SOURCE_DIR, PREPARED_DIR, EXCLUDED_PATHS);
    

  } catch (error) {
    console.error(`Error preparing build: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
prepareForPages();
