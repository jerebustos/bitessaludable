/**
 * Stitch Backend Configuration & Connection Credentials
 * Configura la app ID de Stitch / MongoDB App Services
 */

export const STITCH_CONFIG = {
  appId: 'bitessaludable-app-xyz',
  clusterName: 'mongodb-atlas',
  dbName: 'bitessaludable_db',
  collections: {
    products: 'products',
    founders: 'founders',
    orders: 'orders'
  },
  // Habilitar simulación local si no hay credenciales de servidor en vivo
  offlineMockMode: true,
  syncIntervalMs: 5000
};
