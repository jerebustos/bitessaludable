import React, { useState, useEffect } from 'react';
import { Search, Flame, Dumbbell, Eye, Plus, Star, Sparkles, Filter } from 'lucide-react';
import { stitchService } from '../services/stitchService';
import ProductModal from './ProductModal';

export default function ProductGallery({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const data = await stitchService.getProducts();
      setProducts(data);
      setLoading(false);
    }
    loadProducts();
  }, []);

  const categories = [
    { id: 'todos', name: 'Todos los Platos' },
    { id: 'bowls', name: 'Bowls Nutritivos' },
    { id: 'mealprep', name: 'Meal Prep Semanal' },
    { id: 'jugos', name: 'Jugos Detox' },
    { id: 'snacks', name: 'Snacks & Dulces Fit' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'todos' || product.category === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="productos" style={{ padding: '6rem 0', background: 'var(--bg-cream)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem auto' }}>
          <div className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            <Sparkles size={14} /> Menú Saludable & Nutritivo
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Nuestros Productos Estrella
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Selección artesanal preparada diariamente con ingredientes frescos, balance macronutricional optimizado y cero conservantes artificiales.
          </p>
        </div>

        {/* Filter Bar & Search Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3rem' }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '0.65rem 1.35rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  border: activeCategory === cat.id ? 'none' : '1px solid var(--border-light)',
                  background: activeCategory === cat.id 
                    ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)' 
                    : '#ffffff',
                  color: activeCategory === cat.id ? '#ffffff' : 'var(--text-dark)',
                  boxShadow: activeCategory === cat.id ? '0 4px 14px rgba(30, 130, 134, 0.3)' : 'var(--shadow-sm)'
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div style={{ position: 'relative', maxWidth: '450px', margin: '0 auto', width: '100%' }}>
            <Search 
              size={18} 
              color="var(--text-light)" 
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input 
              type="text"
              placeholder="Buscar por ingrediente o plato (ej: pollo, salmón, avena)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.8rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-light)',
                background: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none',
                boxShadow: 'var(--shadow-sm)',
                transition: 'border-color 0.2s'
              }}
            />
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
            Cargando nuestro menú fresco desde Stitch...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No se encontraron productos en esta categoría. Intenta cambiar el filtro de búsqueda.
          </div>
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '2rem'
            }}
          >
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Product Image Container */}
                <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={product.image} 
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                  
                  {/* Badge Star Product */}
                  {product.isStarProduct && (
                    <div style={{
                      position: 'absolute',
                      top: '0.85rem',
                      left: '0.85rem',
                      background: 'rgba(252, 228, 214, 0.95)',
                      color: '#8C4318',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      <Star size={12} fill="#8C4318" /> Estrella
                    </div>
                  )}

                  {/* Nutrition Badges */}
                  <div style={{
                    position: 'absolute',
                    bottom: '0.85rem',
                    right: '0.85rem',
                    display: 'flex',
                    gap: '0.4rem'
                  }}>
                    <span className="badge badge-accent" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                      <Flame size={12} /> {product.calories} kcal
                    </span>
                    <span className="badge badge-primary" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)' }}>
                      <Dumbbell size={12} /> {product.protein}
                    </span>
                  </div>
                </div>

                {/* Product Content Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                    {product.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                  {/* Price & Action Row */}
                  <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>PRECIO</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                        ${product.price.toLocaleString('es-AR')} ARS
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        title="Ver detalle de ingredientes"
                        className="btn btn-secondary btn-icon"
                        aria-label="Ver detalles"
                      >
                        <Eye size={18} color="var(--color-primary)" />
                      </button>
                      
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="btn btn-primary"
                        style={{ padding: '0.6rem 1.1rem', fontSize: '0.85rem' }}
                      >
                        <Plus size={16} /> Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal details popup */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={onAddToCart}
        />
      )}
    </section>
  );
}
