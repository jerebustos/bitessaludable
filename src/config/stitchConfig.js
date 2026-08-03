/**
 * Stitch Backend & Cloud Storage Configuration
 * Configura la sincronización remota en la nube para Bitessaludable (Cloudflare KV Cloud Sync)
 */

export const STITCH_CONFIG = {
  appId: 'bitessaludable-app-xyz',
  clusterName: 'cloudflare-kv-cluster',
  dbName: 'bitessaludable_db',
  collections: {
    products: 'products',
    founders: 'founders',
    orders: 'orders'
  },
  cloudActive: true,
  cloudEndpoint: '/api/products',
  syncIntervalMs: 10000
};
