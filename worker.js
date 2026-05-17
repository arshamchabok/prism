const allowedOrigins = new Set(['https://arshamchabok.github.io', 'http://localhost:3000']);

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get('Origin') || '';
    const origin = allowedOrigins.has(requestOrigin) ? requestOrigin : '';
    const corsHeaders = {
      ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders,
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/') {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response('Missing ANTHROPIC_API_KEY', { status: 500, headers: corsHeaders });
    }

    const body = await request.text();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body,
    });

    const responseBody = await response.text();
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', origin);
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');
    responseHeaders.set('Access-Control-Expose-Headers', 'Content-Type');

    return new Response(responseBody, {
      status: response.status,
      headers: responseHeaders,
    });
  },
};
