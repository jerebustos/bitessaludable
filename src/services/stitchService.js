import { STITCH_CONFIG } from '../config/stitchConfig.js';

// MOCK DATA INICIAL BASE DE PRODUCTOS Y FUNDADORAS
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    title: 'Bowl Proteico Power',
    category: 'boxgourmet',
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
    category: 'boxgourmet',
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
    category: 'panificados',
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
    title: 'Tarta Fit & Masa Artesanal',
    category: 'pasteleria',
    price: 3200,
    image: '/assets/green_juice.jpg',
    description: 'Deliciosa opción dulce o salada con ingredientes seleccionados de primera calidad, harinas integrales y bajo en azúcar.',
    ingredients: ['Harina integral', 'Huevos de campo', 'Frutos secos', 'Esencia vegetal', 'Stevia'],
    calories: 220,
    protein: '12g',
    carbs: '28g',
    fat: '6g',
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
    name: 'Yesi & Maru',
    role: 'Fundadoras & Creadoras de bitessaludable',
    bio: 'Apasionadas por la alimentación consciente y la vida saludable en Santa Rosa, La Pampa. Creamos bitessaludable con el sueño de ofrecer platos deliciosos, equilibrados y llenos de color que cuiden tu cuerpo sin sacrificar el sabor.',
    quote: 'Comer sano no tiene por qué ser aburrido. Cada receta que preparamos tiene el equilibrio perfecto entre nutrición y placer.',
    photo: '/assets/founders_photo.jpg'
  }
];

/**
 * Servicio Stitch para consulta y sincronización de datos con persistencia en localStorage
 */
class StitchService {
  constructor() {
    this.isConnected = true;
    this.useMock = STITCH_CONFIG.offlineMockMode;
    this.listeners = [];
    this.STORAGE_KEY = 'bitessaludable_products';
  }

  _getLocalProducts() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migración de categorías viejas a las nuevas opciones
        const categoryMap = {
          bowls: 'boxgourmet',
          mealprep: 'panificados',
          jugos: 'pasteleria'
        };
        const migrated = parsed.map(p => {
          if (categoryMap[p.category]) {
            return { ...p, category: categoryMap[p.category] };
          }
          return p;
        });
        return migrated;
      }
    } catch (e) {
      console.warn('Error al leer de localStorage:', e);
    }
    // Si no hay almacenados, guardamos y retornamos los productos iniciales
    this._saveLocalProducts(INITIAL_PRODUCTS);
    return INITIAL_PRODUCTS;
  }

  _saveLocalProducts(products) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      this.notifyListeners(products);
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners(products) {
    this.listeners.forEach(listener => listener(products));
  }

  // Obtener todos los productos
  async getProducts() {
    try {
      const products = this._getLocalProducts();
      return new Promise((resolve) => {
        setTimeout(() => resolve(products), 100);
      });
    } catch (error) {
      console.warn('Stitch fetch error, usando fallback local:', error);
      return INITIAL_PRODUCTS;
    }
  }

  // Agregar nuevo producto
  async addProduct(newProductData) {
    const currentProducts = this._getLocalProducts();
    const newProduct = {
      id: 'prod-' + Date.now(),
      title: newProductData.title || 'Nuevo Producto',
      category: newProductData.category || 'pasteleria',
      price: Number(newProductData.price) || 0,
      image: newProductData.image || '/assets/bowl_protein.jpg',
      description: newProductData.description || '',
      ingredients: Array.isArray(newProductData.ingredients)
        ? newProductData.ingredients
        : (newProductData.ingredients || '').split(',').map(i => i.trim()).filter(Boolean),
      calories: Number(newProductData.calories) || 0,
      protein: typeof newProductData.protein === 'number' ? `${newProductData.protein}g` : (newProductData.protein || '0g'),
      carbs: typeof newProductData.carbs === 'number' ? `${newProductData.carbs}g` : (newProductData.carbs || '0g'),
      fat: typeof newProductData.fat === 'number' ? `${newProductData.fat}g` : (newProductData.fat || '0g'),
      isStarProduct: Boolean(newProductData.isStarProduct),
      inStock: newProductData.inStock !== undefined ? Boolean(newProductData.inStock) : true
    };

    const updated = [newProduct, ...currentProducts];
    this._saveLocalProducts(updated);
    return newProduct;
  }

  // Actualizar solo precio de un producto
  async updateProductPrice(productId, newPrice) {
    const currentProducts = this._getLocalProducts();
    const updated = currentProducts.map(prod => {
      if (prod.id === productId) {
        return { ...prod, price: Number(newPrice) };
      }
      return prod;
    });
    this._saveLocalProducts(updated);
    return updated.find(p => p.id === productId);
  }

  // Actualizar datos de un producto existente
  async updateProduct(productId, updatedFields) {
    const currentProducts = this._getLocalProducts();
    const updated = currentProducts.map(prod => {
      if (prod.id === productId) {
        return { ...prod, ...updatedFields };
      }
      return prod;
    });
    this._saveLocalProducts(updated);
    return updated.find(p => p.id === productId);
  }

  // Eliminar producto
  async deleteProduct(productId) {
    const currentProducts = this._getLocalProducts();
    const updated = currentProducts.filter(prod => prod.id !== productId);
    this._saveLocalProducts(updated);
    return true;
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
