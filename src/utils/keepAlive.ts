/**
 * Keep-alive utility to prevent Render free tier services from spinning down due to inactivity
 */

// Configuration
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
// Use relative URLs to avoid CORS issues in development
const BACKEND_HEALTH_ENDPOINT = '/api/health';

/**
 * Ping services to keep them alive
 */
async function pingServices() {
  try {
    // Ping health endpoint
    const response = await fetch(BACKEND_HEALTH_ENDPOINT, { 
      method: 'GET',
      cache: 'no-store',
      headers: { 'Keep-Alive': 'true' }
    });
    
    if (response.ok) {
      console.log(`[KeepAlive] Service pinged successfully at ${new Date().toISOString()}`);
    } else {
      console.warn(`[KeepAlive] Service ping returned status: ${response.status}`);
    }
  } catch (_error) {
    // Just log the error but don't throw - we don't want to break the app
    console.warn('[KeepAlive] Error pinging services - this is expected in development');
  }
}

/**
 * Start the keep-alive service
 * This should be called only on the client-side
 */
export function startKeepAlive() {
  // Only run in production environment
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }

  
  // Initial ping
  pingServices();
  
  // Set up interval for regular pings
  setInterval(pingServices, PING_INTERVAL);
}

export default startKeepAlive;
