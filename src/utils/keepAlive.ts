/**
 * Keep-alive utility to prevent Render free tier services from spinning down due to inactivity
 */

// Configuration
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.azlok.com';
const FRONTEND_URL = 'https://azlok.com';

/**
 * Ping both frontend and backend services to keep them alive
 */
async function pingServices() {
  try {
    // Ping backend
    await fetch(`${BACKEND_URL}/health`, { 
      method: 'GET',
      cache: 'no-store',
      headers: { 'Keep-Alive': 'true' }
    });
    
    // Ping frontend (self)
    await fetch(`${FRONTEND_URL}/api/health`, {
      method: 'GET',
      cache: 'no-store',
      headers: { 'Keep-Alive': 'true' }
    });
    
    console.log(`[KeepAlive] Services pinged at ${new Date().toISOString()}`);
  } catch (error) {
    console.error('[KeepAlive] Error pinging services:', error);
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

  console.log('[KeepAlive] Starting keep-alive service');
  
  // Initial ping
  pingServices();
  
  // Set up interval for regular pings
  setInterval(pingServices, PING_INTERVAL);
}

export default startKeepAlive;
