// Cloudflare Worker script to handle Node.js compatibility

export default {
  async fetch(request, env, ctx) {
    // Add Node.js compatibility flag to response headers
    const response = await env.ASSETS.fetch(request);
    const newResponse = new Response(response.body, response);
    
    // Add headers to indicate Node.js compatibility
    newResponse.headers.set('X-Nodejs-Compat', 'enabled');
    
    return newResponse;
  }
};
