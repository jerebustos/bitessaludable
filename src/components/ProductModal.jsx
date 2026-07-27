import React from 'react';
import { X, Flame, Dumbbell, Wheat, Heart, Plus, Edit3 } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, isAdminLoggedIn, onEditProduct }) {
  if (!product) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(28, 40, 38, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '650px',
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
        {/* Close button */}
        <button 
          onClick={onClose}
          aria-label="Cerrar ventana"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            zIndex: 20,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0, 0, 0, 0.5)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Image Header (Muestra la foto 100% COMPLETA sin recortar) */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '320px',
          background: 'linear-gradient(135deg, #1C2826 0%, #2A3B38 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          {/* Imagen de fondo difuminada suave */}
          <img 
            src={product.image} 
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(20px) opacity(0.35)',
              transform: 'scale(1.1)'
            }}
          />

          {/* Imagen principal 100% visible sin recortes */}
          <img 
            src={product.image} 
            alt={product.title}
            style={{
              position: 'relative',
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              zIndex: 2,
              borderRadius: 'var(--radius-sm)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
            }}
          />

          {/* Badges en la imagen */}
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1.5rem',
            display: 'flex',
            gap: '0.5rem',
            zIndex: 10
          }}>
            <span className="badge badge-peach" style={{ fontWeight: '700', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              ${product.price.toLocaleString('es-AR')} ARS
            </span>
            {product.isStarProduct && (
              <span className="badge badge-primary" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.3)', background: 'rgba(255,255,255,0.92)' }}>
                Producto Estrella
              </span>
            )}
          </div>
        </div>

        {/* Modal Content Scrollable */}
        <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
            {product.title}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {product.description}
          </p>

          {/* Nutritional Facts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-cream)',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Flame size={18} color="var(--color-accent)" style={{ margin: '0 auto 0.25rem' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Calorías</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{product.calories} kcal</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Dumbbell size={18} color="var(--color-primary)" style={{ margin: '0 auto 0.25rem' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Proteínas</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{product.protein}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Wheat size={18} color="var(--color-secondary)" style={{ margin: '0 auto 0.25rem' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carbos</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{product.carbs}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Heart size={18} color="#E11D48" style={{ margin: '0 auto 0.25rem' }} />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grasas</div>
              <div style={{ fontWeight: '700', fontSize: '1rem' }}>{product.fat}</div>
            </div>
          </div>

          {/* Ingredients list */}
          <div style={{ marginBottom: '1.75rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Ingredientes Seleccionados:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {Array.isArray(product.ingredients) ? product.ingredients.map((ing, i) => (
                <span key={i} className="badge badge-secondary" style={{ fontSize: '0.8rem' }}>
                  • {ing}
                </span>
              )) : (
                <span className="badge badge-secondary" style={{ fontSize: '0.8rem' }}>
                  • {product.ingredients}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {isAdminLoggedIn && (
              <button 
                onClick={() => {
                  if (onEditProduct) onEditProduct(product);
                  onClose();
                }}
                className="btn btn-secondary"
                style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit3 size={18} /> Editar Detalles
              </button>
            )}

            <button 
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.9rem' }}
              disabled={product.inStock === false}
            >
              <Plus size={18} /> {product.inStock === false ? 'Sin Stock Disponible' : `Agregar al Pedido ($${product.price.toLocaleString('es-AR')})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
