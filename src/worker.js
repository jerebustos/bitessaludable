export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API Routes para gestión persistente de productos en Cloudflare KV
    if (url.pathname === '/api/products') {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json; charset=utf-8'
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

    // Para todas las demás peticiones, servir los recursos estáticos web generados en Vite (dist)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Bitessaludable Asset Server', { status: 200 });
  }
};
