import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3, Save, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon, Flame, Dumbbell, Wheat, Heart, Star, PackageCheck, LogOut, Upload } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function AdminPanelModal({ isOpen, onClose, onLogout }) {
  const [activeTab, setActiveTab] = useState('add'); // 'add' | 'prices'
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form states for new product
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'bowls',
    price: '',
    image: '/assets/bowl_protein.jpg',
    description: '',
    ingredients: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    isStarProduct: false,
    inStock: true
  });

  // Price edits state object { [productId]: price }
  const [priceEdits, setPriceEdits] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await stitchService.getProducts();
    setProducts(data);
    
    // Initialize price edits
    const initialEdits = {};
    data.forEach(p => {
      initialEdits[p.id] = p.price;
    });
    setPriceEdits(initialEdits);
    setLoading(false);
  };

  if (!isOpen) return null;

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Preset sample images for quick selection
  const SAMPLE_IMAGES = [
    { label: 'Bowl Proteico', url: '/assets/bowl_protein.jpg' },
    { label: 'Salmón Bowl', url: '/assets/bowl_salmon.jpg' },
    { label: 'Meal Prep', url: '/assets/meal_prep_pack.jpg' },
    { label: 'Jugo Verde', url: '/assets/green_juice.jpg' },
    { label: 'Snacks Fit', url: '/assets/snacks_fit.jpg' }
  ];

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price || !newProduct.description) {
      showToast('Por favor completa los campos obligatorios.', 'error');
      return;
    }

    try {
      await stitchService.addProduct({
        ...newProduct,
        price: Number(newProduct.price),
        calories: Number(newProduct.calories) || 0,
        protein: newProduct.protein ? (newProduct.protein.endsWith('g') ? newProduct.protein : `${newProduct.protein}g`) : '0g',
        carbs: newProduct.carbs ? (newProduct.carbs.endsWith('g') ? newProduct.carbs : `${newProduct.carbs}g`) : '0g',
        fat: newProduct.fat ? (newProduct.fat.endsWith('g') ? newProduct.fat : `${newProduct.fat}g`) : '0g'
      });

      showToast(`¡Producto "${newProduct.title}" agregado exitosamente!`);
      
      // Reset form
      setNewProduct({
        title: '',
        category: 'bowls',
        price: '',
        image: '/assets/bowl_protein.jpg',
        description: '',
        ingredients: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        isStarProduct: false,
        inStock: true
      });

      await loadProducts();
      setActiveTab('prices');
    } catch (err) {
      showToast('Ocurrió un error al guardar el producto.', 'error');
    }
  };

  const handleSavePrice = async (productId, currentTitle) => {
    const newPrice = priceEdits[productId];
    if (newPrice === undefined || newPrice === '' || isNaN(newPrice) || Number(newPrice) < 0) {
      showToast('Ingresa un precio válido.', 'error');
      return;
    }

    try {
      await stitchService.updateProductPrice(productId, newPrice);
      showToast(`Precio de "${currentTitle}" actualizado a $${Number(newPrice).toLocaleString('es-AR')} ARS`);
      await loadProducts();
    } catch (err) {
      showToast('Error al actualizar el precio.', 'error');
    }
  };

  const handleToggleStock = async (product) => {
    try {
      await stitchService.updateProduct(product.id, { inStock: !product.inStock });
      showToast(`Stock de "${product.title}" ${!product.inStock ? 'activado' : 'pausado'}`);
      await loadProducts();
    } catch (err) {
      showToast('Error al modificar stock.', 'error');
    }
  };

  const handleDeleteProduct = async (productId, title) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${title}"?`)) {
      try {
        await stitchService.deleteProduct(productId);
        showToast(`Producto "${title}" eliminado.`);
        await loadProducts();
      } catch (err) {
        showToast('Error al eliminar producto.', 'error');
      }
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(20, 30, 28, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-light)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.75rem',
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem' }}>
                ADMIN PANEL
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0 }}>
                Administración de Productos & Precios
              </h2>
            </div>
            <p style={{ fontSize: '0.825rem', opacity: 0.9, marginTop: '0.2rem' }}>
              Gestiona el catálogo, agrega nuevos platos y modifica precios en tiempo real
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={onLogout}
              className="btn"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '0.5rem 0.9rem',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
              title="Cerrar sesión de administrador"
            >
              <LogOut size={14} /> Salir Admin
            </button>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--bg-cream)',
          padding: '0 1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('add')}
            style={{
              padding: '1rem 1.25rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              border: 'none',
              borderBottom: activeTab === 'add' ? '3px solid var(--color-primary)' : '3px solid transparent',
              background: 'none',
              color: activeTab === 'add' ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <PlusCircle size={18} /> Agregar Nuevo Producto
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            style={{
              padding: '1rem 1.25rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              border: 'none',
              borderBottom: activeTab === 'prices' ? '3px solid var(--color-primary)' : '3px solid transparent',
              background: 'none',
              color: activeTab === 'prices' ? 'var(--color-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <Edit3 size={18} /> Modificar Precios & Stock ({products.length})
          </button>
        </div>

        {/* Toast Notification Alert */}
        {notification && (
          <div style={{
            position: 'absolute',
            top: '4.5rem',
            right: '1.5rem',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'error' ? '#FEE2E2' : '#D1FAE5',
            color: notification.type === 'error' ? '#991B1B' : '#065F46',
            border: `1px solid ${notification.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`,
            boxShadow: 'var(--shadow-md)',
            fontSize: '0.875rem',
            fontWeight: '600',
            animation: 'fadeIn 0.2s ease'
          }}>
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Content Body Scrollable */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          
          {/* TAB 1: AGREGAR NUEVO PRODUCTO */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddProductSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                
                {/* Título */}
                <div>
                  <label style={labelStyle}>Título / Nombre del Plato *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ej: Salad Bowl Mediterráneo"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label style={labelStyle}>Categoría *</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="bowls">Bowls Nutritivos</option>
                    <option value="mealprep">Meal Prep Semanal</option>
                    <option value="jugos">Jugos Detox</option>
                    <option value="snacks">Snacks & Dulces Fit</option>
                  </select>
                </div>

                {/* Precio */}
                <div>
                  <label style={labelStyle}>Precio ($ ARS) *</label>
                  <input 
                    type="number"
                    required
                    min="0"
                    step="50"
                    placeholder="Ej: 5200"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                {/* Imagen URL o Subir desde Ordenador */}
                <div>
                  <label style={labelStyle}>Imagen del Producto *</label>
                  
                  {/* Contenedor de Opciones de Carga de Imagen */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {/* Botón para seleccionar archivo desde el ordenador */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <label 
                        className="btn btn-secondary"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          padding: '0.6rem 0.9rem',
                          background: '#ffffff',
                          border: '1px solid var(--border-light)',
                          borderRadius: 'var(--radius-sm)'
                        }}
                      >
                        <Upload size={16} color="var(--color-primary)" /> Subir desde mi ordenador
                        <input 
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setNewProduct(prev => ({ ...prev, image: event.target?.result }));
                                showToast('Imagen cargada correctamente desde tu ordenador.');
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>o ingresa una URL</span>
                    </div>

                    {/* Campo de texto para URL manual */}
                    <input 
                      type="text"
                      required
                      placeholder="Ej: /assets/bowl_protein.jpg o data:image..."
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      style={inputStyle}
                    />

                    {/* Previsualización de la Imagen */}
                    {newProduct.image && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.2rem' }}>
                        <img 
                          src={newProduct.image} 
                          alt="Vista previa" 
                          style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '2px solid var(--color-primary-light)'
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vista previa de imagen</span>
                      </div>
                    )}
                  
                    {/* Preset images fast buttons */}
                    <div style={{ marginTop: '0.2rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Presets:</span>
                      {SAMPLE_IMAGES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, image: sample.url })}
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--border-light)',
                            background: newProduct.image === sample.url ? 'var(--color-primary-light)' : '#f3f4f6',
                            color: 'var(--text-dark)',
                            cursor: 'pointer'
                          }}
                        >
                          {sample.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Descripción Detallada *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Describe la preparación, frescura, combinación de sabores..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              {/* Ingredientes */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Ingredientes (separados por coma)</label>
                <input 
                  type="text"
                  placeholder="Ej: Quinoa, Pollo grillado, Palta, Brocoli, Sésamo"
                  value={newProduct.ingredients}
                  onChange={(e) => setNewProduct({ ...newProduct, ingredients: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Información Nutricional */}
              <div style={{
                background: 'var(--bg-cream)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-light)'
              }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>
                  Información Nutricional (Macronutrientes)
                </h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={subLabelStyle}><Flame size={12} color="var(--color-accent)" /> Calorías (kcal)</label>
                    <input 
                      type="number"
                      placeholder="450"
                      value={newProduct.calories}
                      onChange={(e) => setNewProduct({ ...newProduct, calories: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={subLabelStyle}><Dumbbell size={12} color="var(--color-primary)" /> Proteínas (g)</label>
                    <input 
                      type="text"
                      placeholder="35g"
                      value={newProduct.protein}
                      onChange={(e) => setNewProduct({ ...newProduct, protein: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={subLabelStyle}><Wheat size={12} color="var(--color-secondary)" /> Carbohidratos (g)</label>
                    <input 
                      type="text"
                      placeholder="30g"
                      value={newProduct.carbs}
                      onChange={(e) => setNewProduct({ ...newProduct, carbs: e.target.value })}
                      style={inputStyle}
                    />
                  </div>

                  <div>
                    <label style={subLabelStyle}><Heart size={12} color="#E11D48" /> Grasas (g)</label>
                    <input 
                      type="text"
                      placeholder="12g"
                      value={newProduct.fat}
                      onChange={(e) => setNewProduct({ ...newProduct, fat: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              </div>

              {/* Opciones booleanas */}
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox"
                    checked={newProduct.isStarProduct}
                    onChange={(e) => setNewProduct({ ...newProduct, isStarProduct: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                  />
                  <Star size={16} fill={newProduct.isStarProduct ? '#8C4318' : 'none'} color="#8C4318" /> Producto Estrella (Destacado)
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                  <input 
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                  />
                  <PackageCheck size={16} color="var(--color-primary)" /> Disponible en Stock
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }}
              >
                <PlusCircle size={18} /> Publicar Nuevo Producto
              </button>
            </form>
          )}

          {/* TAB 2: MODIFICAR PRECIOS & STOCK */}
          {activeTab === 'prices' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Edita los precios directamente en la casilla de cada producto y presiona <strong>Guardar</strong> para actualizar la tienda en tiempo real.
              </p>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>Cargando catálogo de productos...</div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>No hay productos guardados.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {products.map(product => (
                    <div 
                      key={product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        padding: '1rem 1.25rem',
                        background: '#ffffff',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: 'var(--shadow-sm)',
                        flexWrap: 'wrap'
                      }}
                    >
                      {/* Product Thumbnail & Details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 250px' }}>
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          style={{
                            width: '54px',
                            height: '54px',
                            borderRadius: 'var(--radius-sm)',
                            objectFit: 'cover',
                            border: '1px solid var(--border-light)'
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-dark)' }}>
                            {product.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                            <span style={{ textTransform: 'capitalize' }}>Cat: {product.category}</span>
                            <span>•</span>
                            <span>{product.calories} kcal</span>
                            {product.isStarProduct && <span>• ⭐ Estrella</span>}
                          </div>
                        </div>
                      </div>

                      {/* Stock Badge Toggle */}
                      <button
                        onClick={() => handleToggleStock(product)}
                        style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          border: 'none',
                          cursor: 'pointer',
                          background: product.inStock ? '#D1FAE5' : '#FEE2E2',
                          color: product.inStock ? '#065F46' : '#991B1B'
                        }}
                      >
                        {product.inStock ? 'En Stock' : 'Pausado'}
                      </button>

                      {/* Price Edit Control */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 0 auto' }}>
                        <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-dark)' }}>$</span>
                        <input 
                          type="number"
                          min="0"
                          step="50"
                          value={priceEdits[product.id] !== undefined ? priceEdits[product.id] : product.price}
                          onChange={(e) => setPriceEdits({ ...priceEdits, [product.id]: e.target.value })}
                          style={{
                            width: '110px',
                            padding: '0.45rem 0.6rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            textAlign: 'right'
                          }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ARS</span>

                        <button
                          onClick={() => handleSavePrice(product.id, product.title)}
                          className="btn btn-primary"
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem' }}
                          title="Guardar nuevo precio"
                        >
                          <Save size={14} /> Guardar
                        </button>

                        <button
                          onClick={() => handleDeleteProduct(product.id, product.title)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#EF4444',
                            padding: '0.45rem',
                            cursor: 'pointer',
                            borderRadius: 'var(--radius-sm)'
                          }}
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '700',
  color: 'var(--text-dark)',
  marginBottom: '0.4rem'
};

const subLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontSize: '0.75rem',
  fontWeight: '600',
  color: 'var(--text-muted)',
  marginBottom: '0.3rem'
};

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--border-light)',
  fontSize: '0.9rem',
  outline: 'none',
  background: '#ffffff',
  boxShadow: 'var(--shadow-sm)'
};
