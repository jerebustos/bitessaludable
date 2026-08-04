// Helper para inyectar encabezados de seguridad HTTP y caché inmutable de activos en cualquier respuesta
function addSecurityHeaders(response, requestUrl = '') {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-Frame-Options', 'DENY');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Optimización LCP & WPO: Caché agresiva inmutable (1 año) para imágenes y activos estáticos
  if (requestUrl.includes('/assets/') || /\.(jpg|jpeg|png|webp|svg|css|js|woff2)$/i.test(requestUrl)) {
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Routes para gestión persistente de productos en Cloudflare KV
    if (url.pathname === '/api/products') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      };

      // Peticiones preflight CORS
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      // Obtener el catálogo de productos almacenado en la nube
      if (request.method === 'GET') {
        try {
          let productsJson = null;
          if (env.PRODUCTS_KV) {
            productsJson = await env.PRODUCTS_KV.get('products_catalog');
          }

          if (!productsJson) {
            return new Response(JSON.stringify({ success: true, products: null }), {
              status: 200,
              headers: corsHeaders
            });
          }

          return new Response(productsJson, {
            status: 200,
            headers: corsHeaders
          });
        } catch (error) {
          console.error('Error al obtener productos de Cloudflare KV:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: corsHeaders
          });
        }
      }

      // Guardar y actualizar permanentemente el catálogo de productos en la nube
      if (request.method === 'POST') {
        try {
          // Verificar autenticación mediante cabecera X-Admin-Token
          const adminToken = request.headers.get('X-Admin-Token');
          const expectedToken = env.ADMIN_SECRET_TOKEN || 'bitessaludable-admin-token-2026';
          
          if (adminToken !== expectedToken) {
            return new Response(JSON.stringify({ error: 'Acceso no autorizado. Token de administración inválido.' }), {
              status: 401,
              headers: corsHeaders
            });
          }

          const body = await request.json();
          if (!body || !Array.isArray(body.products)) {
            return new Response(JSON.stringify({ error: 'Formato de productos inválido. Debe ser una lista.' }), {
              status: 400,
              headers: corsHeaders
            });
          }

          if (env.PRODUCTS_KV) {
            await env.PRODUCTS_KV.put('products_catalog', JSON.stringify(body.products));
          }

          return new Response(JSON.stringify({ success: true, count: body.products.length, timestamp: new Date().toISOString() }), {
            status: 200,
            headers: corsHeaders
          });
        } catch (error) {
          console.error('Error al guardar productos en Cloudflare KV:', error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: corsHeaders
          });
        }
      }
    }

    // API Routes para gestión persistente de creadoras/fundadoras en Cloudflare KV
    if (url.pathname === '/api/founders') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Content-Type': 'application/json; charset=utf-8',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
      }

      if (request.method === 'GET') {
        try {
          let foundersJson = null;
          if (env.PRODUCTS_KV) {
            foundersJson = await env.PRODUCTS_KV.get('founders_catalog');
          }
          if (!foundersJson) {
            return new Response(JSON.stringify({ success: true, founders: null }), {
              status: 200,
              headers: corsHeaders
            });
          }
          return new Response(foundersJson, { status: 200, headers: corsHeaders });
        } catch (error) {
          console.error('Error al obtener creadoras de Cloudflare KV:', error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
        }
      }

      if (request.method === 'POST') {
        try {
          const adminToken = request.headers.get('X-Admin-Token');
          const expectedToken = env.ADMIN_SECRET_TOKEN || 'bitessaludable-admin-token-2026';
          if (adminToken !== expectedToken) {
            return new Response(JSON.stringify({ error: 'Acceso no autorizado. Token de administración inválido.' }), {
              status: 401,
              headers: corsHeaders
            });
          }

          const body = await request.json();
          if (!body || !Array.isArray(body.founders)) {
            return new Response(JSON.stringify({ error: 'Formato de creadoras inválido. Debe ser una lista.' }), {
              status: 400,
              headers: corsHeaders
            });
          }

          if (env.PRODUCTS_KV) {
            await env.PRODUCTS_KV.put('founders_catalog', JSON.stringify(body.founders));
          }

          return new Response(JSON.stringify({ success: true, count: body.founders.length, timestamp: new Date().toISOString() }), {
            status: 200,
            headers: corsHeaders
          });
        } catch (error) {
          console.error('Error al guardar creadoras en Cloudflare KV:', error);
          return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
        }
      }
    }

    // Para todas las demás peticiones, servir los recursos estáticos web generados en Vite con encabezados de seguridad y caché
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      return addSecurityHeaders(assetResponse, request.url);
    }

    return addSecurityHeaders(new Response('Bitessaludable Asset Server', { status: 200 }), request.url);
  }
};
