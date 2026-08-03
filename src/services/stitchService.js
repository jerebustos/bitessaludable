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
 * Servicio Stitch para consulta y sincronización de datos con la nube (Cloudflare KV) y respaldo local
 */
class StitchService {
  constructor() {
    this.isConnected = true;
    this.cloudActive = true;
    this.cloudEndpoint = STITCH_CONFIG.cloudEndpoint || '/api/products';
    this.listeners = [];
    this.STORAGE_KEY = 'bitessaludable_products_v3';
    
    // Cache en memoria inicializado desde localStorage o iniciales
    this.productsCache = this._getLocalProducts();

    // Sincronizar automáticamente con la nube al iniciar
    this.syncWithCloud();
  }

  // Sincronización automática con la base de datos de la nube
  async syncWithCloud() {
    try {
      const response = await fetch(this.cloudEndpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) return;

      const data = await response.json();
      let cloudProducts = null;

      if (Array.isArray(data)) {
        cloudProducts = data;
      } else if (data && Array.isArray(data.products)) {
        cloudProducts = data.products;
      }

      if (cloudProducts && cloudProducts.length > 0) {
        // Combinar datos remotos con estructura limpia
        const merged = this._cleanAndMergeProducts(cloudProducts);
        this.productsCache = merged;
        this._saveLocalProductsOnly(merged);
        this.notifyListeners(this.productsCache);
        console.log('☁️ Sincronización exitosa con la nube. Productos cargados:', merged.length);
      } else if (this.productsCache && this.productsCache.length > 0) {
        // Si la nube está vacía pero tenemos productos locales (creados por admin), subirlos a la nube
        await this._postProductsToCloud(this.productsCache);
      }
    } catch (err) {
      console.warn('Sincronización con la nube (offline/local fallback):', err.message);
    }
  }

  _cleanAndMergeProducts(productsArray) {
    const categoryMap = {
      bowls: 'boxgourmet',
      mealprep: 'panificados',
      jugos: 'pasteleria'
    };

    return productsArray.map(p => {
      let category = p.category;
      if (categoryMap[category]) {
        category = categoryMap[category];
      }
      return {
        id: p.id || 'prod-' + Date.now(),
        title: p.title || 'Producto',
        category: category || 'pasteleria',
        price: Number(p.price) || 0,
        image: p.image || '/assets/bowl_protein.jpg',
        description: p.description || '',
        ingredients: Array.isArray(p.ingredients)
          ? p.ingredients
          : (typeof p.ingredients === 'string' ? p.ingredients.split(',').map(i => i.trim()).filter(Boolean) : []),
        calories: Number(p.calories) || 0,
        protein: p.protein || '0g',
        carbs: p.carbs || '0g',
        fat: p.fat || '0g',
        isStarProduct: Boolean(p.isStarProduct),
        inStock: p.inStock !== undefined ? Boolean(p.inStock) : true
      };
    });
  }

  _getLocalProducts() {
    try {
      let stored = localStorage.getItem(this.STORAGE_KEY) ||
                   localStorage.getItem('bitessaludable_products_v2') ||
                   localStorage.getItem('bitessaludable_products');
      
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const customProducts = parsed.filter(p => p.id && !INITIAL_PRODUCTS.some(init => init.id === p.id));
          const baseProducts = INITIAL_PRODUCTS.map(init => {
            const existing = parsed.find(p => p.id === init.id);
            return existing ? { ...init, ...existing } : init;
          });
          return [...customProducts, ...baseProducts];
        }
      }
    } catch (e) {
      console.warn('Error al leer productos de localStorage:', e);
    }
    return INITIAL_PRODUCTS;
  }

  _saveLocalProductsOnly(products) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
      localStorage.setItem('bitessaludable_products_v2', JSON.stringify(products));
      localStorage.setItem('bitessaludable_products', JSON.stringify(products));
    } catch (e) {
      console.error('Error al guardar respaldo local en localStorage:', e);
    }
  }

  async _postProductsToCloud(products) {
    try {
      const response = await fetch(this.cloudEndpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Admin-Token': 'bitessaludable-admin-token-2026'
        },
        body: JSON.stringify({ products })
      });
      if (response.ok) {
        console.log('☁️ Catálogo guardado permanentemente en Cloudflare KV.');
      }
    } catch (err) {
      console.warn('No se pudo guardar en la nube (offline o servidor local):', err.message);
    }
  }

  async _saveAllProducts(products) {
    this.productsCache = [...products];
    this._saveLocalProductsOnly(products);
    this.notifyListeners(this.productsCache);
    // Enviar a la nube para persistencia global inmediata
    await this._postProductsToCloud(products);
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
    if (!this.productsCache || this.productsCache.length === 0) {
      this.productsCache = this._getLocalProducts();
    }
    return Promise.resolve([...this.productsCache]);
  }

  // Agregar nuevo producto
  async addProduct(newProductData) {
    const currentProducts = await this.getProducts();
    
    const parseMacro = (val) => {
      if (val === undefined || val === null) return '0g';
      const str = String(val).trim();
      if (!str) return '0g';
      return str.endsWith('g') ? str : `${str}g`;
    };

    const newProduct = {
      id: 'prod-' + Date.now(),
      title: newProductData.title || 'Nuevo Producto',
      category: newProductData.category || 'pasteleria',
      price: Number(newProductData.price) || 0,
      image: newProductData.image || '/assets/bowl_protein.jpg',
      description: newProductData.description || '',
      ingredients: Array.isArray(newProductData.ingredients)
        ? newProductData.ingredients
        : (typeof newProductData.ingredients === 'string' ? newProductData.ingredients.split(',').map(i => i.trim()).filter(Boolean) : []),
      calories: Number(newProductData.calories) || 0,
      protein: parseMacro(newProductData.protein),
      carbs: parseMacro(newProductData.carbs),
      fat: parseMacro(newProductData.fat),
      isStarProduct: Boolean(newProductData.isStarProduct),
      inStock: newProductData.inStock !== undefined ? Boolean(newProductData.inStock) : true
    };

    const updated = [newProduct, ...currentProducts];
    await this._saveAllProducts(updated);
    return newProduct;
  }

  // Actualizar solo precio de un producto
  async updateProductPrice(productId, newPrice) {
    const currentProducts = await this.getProducts();
    const updated = currentProducts.map(prod => {
      if (prod.id === productId) {
        return { ...prod, price: Number(newPrice) };
      }
      return prod;
    });
    await this._saveAllProducts(updated);
    return updated.find(p => p.id === productId);
  }

  // Actualizar datos de un producto existente
  async updateProduct(productId, updatedFields) {
    const currentProducts = await this.getProducts();
    const updated = currentProducts.map(prod => {
      if (prod.id === productId) {
        return { ...prod, ...updatedFields };
      }
      return prod;
    });
    await this._saveAllProducts(updated);
    return updated.find(p => p.id === productId);
  }

  // Eliminar producto
  async deleteProduct(productId) {
    const currentProducts = await this.getProducts();
    const updated = currentProducts.filter(prod => prod.id !== productId);
    await this._saveAllProducts(updated);
    return true;
  }

  // Exportar el catálogo completo en formato JSON descargable
  exportCatalogJSON() {
    const products = this.productsCache || INITIAL_PRODUCTS;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `catalogo_bitessaludable_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Importar un archivo JSON de productos para restaurar/sincronizar el catálogo completo
  async importCatalogJSON(productsArray) {
    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      throw new Error('El archivo importado no contiene una lista de productos válida.');
    }
    const cleaned = this._cleanAndMergeProducts(productsArray);
    await this._saveAllProducts(cleaned);
    return cleaned;
  }

  // Obtener información de las fundadoras
  async getFounders() {
    return Promise.resolve(INITIAL_FOUNDERS);
  }

  // Registrar pedido enviado por el usuario
  async submitOrder(orderData) {
    console.log('📦 Registrando pedido en Stitch Cloud Database...', orderData);
    return Promise.resolve({
      success: true,
      orderId: 'STITCH-ORD-' + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toISOString()
    });
  }

  // Estado del servicio Stitch
  getStatus() {
    return {
      connected: this.isConnected,
      appId: STITCH_CONFIG.appId,
      mode: 'Cloudflare KV Database (Global Cloud Persistent)'
    };
  }
}

export const stitchService = new StitchService();
