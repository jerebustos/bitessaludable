import { STITCH_CONFIG } from '../config/stitchConfig.js';

// MOCK DATA INICIAL BASE DE PRODUCTOS Y FUNDADORAS
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Bowl Proteico Power',
    category: 'bowls',
    price: 4800,
    image: '/assets/bowl_protein.jpg',
    description: 'Pechuga de pollo grillada a las finas hierbas, quinoa real, palta cremosa, brocoli al vapor, tomates cherry y huevo pochado con semillas de sésamo.',
    ingredients: ['Pechuga de pollo', 'Quinoa real', 'Palta', 'Brócoli fresco', 'Huevo orgánico', 'Tomates cherry', 'Aceite de oliva extra virgen'],
    calories: 450,
    protein: '38g',
    carbs: '32g',
    fat: '16g',
    isStarProduct: true,
    inStock: true
  },
  {
    id: 'prod-2',
    title: 'Poke Bowl Salmón & Mango',
    category: 'bowls',
    price: 5400,
    image: '/assets/bowl_salmon.jpg',
    description: 'Cubos de salmón rosado fresco, edamame, mango jugoso en cubos, cintas de pepino, repollo morado y palta sobre base de arroz integral marinada.',
    ingredients: ['Salmón atlántico fresco', 'Mango', 'Edamame', 'Pepino', 'Repollo morado', 'Arroz integral', 'Sésamo tostado'],
    calories: 480,
    protein: '34g',
    carbs: '45g',
    fat: '18g',
    isStarProduct: true,
    inStock: true
  },
  {
    id: 'prod-3',
    title: 'Pack Meal Prep Semanal (5 Días)',
    category: 'mealprep',
    price: 21500,
    image: '/assets/meal_prep_pack.jpg',
    description: 'Set de 5 viandas saludables listas para calentar. Elaboradas diariamente con proteína magra, vegetales orgánicos y carbohidratos complejos.',
    ingredients: ['Pavo grillado', 'Camote asado', 'Espárragos verdes', 'Arroz integral', 'Verduras al vapor'],
    calories: 420,
    protein: '40g',
    carbs: '38g',
    fat: '12g',
    isStarProduct: true,
    inStock: true
  },
  {
    id: 'prod-4',
    title: 'Jugo Verde Detox Prensado en Frío',
    category: 'jugos',
    price: 2200,
    image: '/assets/green_juice.jpg',
    description: 'Jugo 100% natural sin agua ni azúcar añadida. Prensado en frío con espinaca orgánica, pepino, manzana verde, apio, limón y toque de menta.',
    ingredients: ['Espinaca orgánica', 'Pepino fresco', 'Manzana verde', 'Apio', 'Limón', 'Menta fresca'],
    calories: 110,
    protein: '3g',
    carbs: '22g',
    fat: '0g',
    isStarProduct: true,
    inStock: true
  },
  {
    id: 'prod-5',
    title: 'Muffins de Avena & Chispas Cacao',
    category: 'snacks',
    price: 2600,
    image: '/assets/snacks_fit.jpg',
    description: 'Nuestra especialidad dulce sin culpa: muffins horneados a base de avena integral, claras de huevo, endulzados con stevia natural y chispas de cacao 70%.',
    ingredients: ['Avena integral sin gluten', 'Cacao 70%', 'Claras de huevo', 'Stevia', 'Esencia de vainilla'],
    calories: 180,
    protein: '8g',
    carbs: '24g',
    fat: '5g',
    isStarProduct: true,
    inStock: true
  }
];

const INITIAL_FOUNDERS = [
  {
    id: 'founder-1',
    name: 'Sofía & Valentina',
    role: 'Nutricionistas & Fundadoras de bitessaludable',
    bio: 'Apasionadas por la nutrición consciente y la gastronomía saludable. Creamos bitessaludable con el sueño de ofrecer platos deliciosos, equilibrados y llenos de color que cuiden tu cuerpo sin sacrificar el sabor.',
    quote: 'Comer sano no tiene por qué ser aburrido. Cada receta que preparamos tiene el equilibrio perfecto entre nutrición y placer.',
    photo: '/assets/founders_photo.jpg'
  }
];

/**
 * Servicio Stitch para consulta y sincronización de datos
 */
class StitchService {
  constructor() {
    this.isConnected = true;
    this.useMock = STITCH_CONFIG.offlineMockMode;
    this.listeners = [];
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      // Si existiera conexión activa con Stitch SDK:
      // const client = Stitch.defaultAppClient;
      // const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('bitessaludable_db');
      // return await db.collection('products').find({}).toArray();
      
      return new Promise((resolve) => {
        setTimeout(() => resolve(INITIAL_PRODUCTS), 150);
      });
    } catch (error) {
      console.warn('Stitch fetch error, usando fallback local:', error);
      return INITIAL_PRODUCTS;
    }
  }

  // Obtener información de las fundadoras
  async getFounders() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(INITIAL_FOUNDERS), 100);
    });
  }

  // Registrar pedido enviado por el usuario
  async submitOrder(orderData) {
    console.log('📦 Registrando pedido en Stitch Database...', orderData);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          orderId: 'STITCH-ORD-' + Math.floor(100000 + Math.random() * 900000),
          timestamp: new Date().toISOString()
        });
      }, 400);
    });
  }

  // Estado del servicio Stitch
  getStatus() {
    return {
      connected: this.isConnected,
      appId: STITCH_CONFIG.appId,
      mode: this.useMock ? 'Stitch Offline-Sync (Activo)' : 'Stitch Live Cloud'
    };
  }
}

export const stitchService = new StitchService();
