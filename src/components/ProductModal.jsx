import React, { useState } from 'react';
import { X, Flame, Dumbbell, Wheat, Heart, Plus, Edit3, Maximize2 } from 'lucide-react';

export default function ProductModal({ product, onClose, onAddToCart, isAdminLoggedIn, onEditProduct }) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!product) return null;

  return (
    <>
      {/* Modal Principal de Detalle de Producto */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.25rem',
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
            maxWidth: '680px',
            maxHeight: '92vh',
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
          {/* Botón de cerrar ventana */}
          <button 
            onClick={onClose}
            aria-label="Cerrar ventana"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              zIndex: 30,
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.55)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(4px)'
            }}
          >
            <X size={20} />
          </button>

          {/* Modal Image Header (Foto Enmarcada de Cerca, Nítida y Apetitosa) */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '380px',
            background: '#1C2826',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {/* Foto principal completa en cover con efecto de hover sutil */}
            <img 
              src={product.image} 
              alt={product.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transition: 'transform 0.5s ease',
                display: 'block'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />

            {/* Degradado oscuro inferior para máxima legibilidad */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 20, 0.85) 0%, rgba(15, 23, 20, 0.25) 50%, rgba(0,0,0,0) 100%)',
              pointerEvents: 'none',
              zIndex: 2
            }} />

            {/* Badges de Precio y Producto Estrella */}
            <div style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.5rem',
              display: 'flex',
              gap: '0.5rem',
              zIndex: 10,
              flexWrap: 'wrap'
            }}>
              <span className="badge badge-peach" style={{ fontWeight: '800', fontSize: '0.95rem', padding: '0.45rem 1rem', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                ${product.price.toLocaleString('es-AR')} ARS
              </span>
              {product.isStarProduct && (
                <span className="badge badge-primary" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.3)', background: 'rgba(255,255,255,0.95)', color: 'var(--color-primary-dark)', fontWeight: '700' }}>
                  ★ Producto Estrella
                </span>
              )}
            </div>

            {/* Botón para Ampliar Foto en Pantalla Completa (Lightbox) */}
            <button
              onClick={() => setIsLightboxOpen(true)}
              title="Ampliar foto en pantalla completa"
              style={{
                position: 'absolute',
                bottom: '1.25rem',
                right: '1.5rem',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                color: 'var(--text-dark)',
                padding: '0.45rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Maximize2 size={14} color="var(--color-primary)" /> Ampliar Foto
            </button>
          </div>

          {/* Modal Content Scrollable */}
          <div style={{ padding: '1.75rem', overflowY: 'auto', flex: 1 }}>
            <h3 style={{ fontSize: '1.65rem', marginBottom: '0.5rem', color: 'var(--text-dark)', fontWeight: '800' }}>
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
              marginBottom: '1.5rem',
              border: '1px solid var(--border-light)'
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

            {/* Lista de Ingredientes Seleccionados */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-dark)' }}>
                Ingredientes Seleccionados:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {Array.isArray(product.ingredients) ? product.ingredients.map((ing, i) => (
                  <span key={i} className="badge badge-secondary" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
                    • {ing}
                  </span>
                )) : (
                  <span className="badge badge-secondary" style={{ fontSize: '0.825rem', padding: '0.35rem 0.75rem' }}>
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
                  style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
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
                style={{ flex: 1, padding: '0.9rem 1.25rem', fontSize: '1rem', fontWeight: '700' }}
                disabled={product.inStock === false}
              >
                <Plus size={18} /> {product.inStock === false ? 'Sin Stock Disponible' : `Agregar al Pedido ($${product.price.toLocaleString('es-AR')})`}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visor de Foto Completa en Pantalla Gigante (Lightbox Modal) */}
      {isLightboxOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 3000,
            background: 'rgba(10, 15, 14, 0.92)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Botón Cerrar Lightbox */}
          <button 
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Cerrar imagen en pantalla completa"
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
          >
            <X size={24} />
          </button>

          {/* Imagen Gigante en Alta Resolución */}
          <img 
            src={product.image} 
            alt={product.title}
            style={{
              maxWidth: '92vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
