import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Clock, Edit3, X, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function Hero({ isAdminLoggedIn }) {
  const [heroData, setHeroData] = useState({
    title: 'Nutrición Consciente que Nutre tu Cuerpo y Alegra tu Día',
    description: 'En bitessaludable elaboramos productos nutritivos, alimentos equilibrados y snacks artesanales sin conservantes, hechos con ingredientes frescos de la más alta calidad.',
    badge: 'Comida Real • 100% Nutritiva & Deliciosa'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function loadHero() {
      const data = await stitchService.getHeroData();
      setHeroData(data);
    }
    loadHero();

    const unsubscribe = stitchService.subscribeHero((updated) => {
      setHeroData(updated);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenEditModal = () => {
    setEditTitle(heroData.title || '');
    setEditDescription(heroData.description || '');
    setEditBadge(heroData.badge || '');
    setIsModalOpen(true);
  };

  const handleSaveHero = async () => {
    if (!editTitle || !editDescription) {
      showToast('Por favor completa el título y la descripción.', 'error');
      return;
    }

    try {
      await stitchService.updateHeroData({
        title: editTitle,
        description: editDescription,
        badge: editBadge
      });
      showToast('¡Título y descripción de portada actualizados!');
      setIsModalOpen(false);
    } catch (err) {
      showToast('Error al guardar los cambios.', 'error');
    }
  };

  return (
    <section 
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '80px',
        overflow: 'hidden'
      }}
    >
      {/* Toast Notification Alert */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '5rem',
          right: '1.5rem',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.85rem 1.35rem',
          borderRadius: 'var(--radius-md)',
          background: notification.type === 'error' ? '#FEE2E2' : '#D1FAE5',
          color: notification.type === 'error' ? '#991B1B' : '#065F46',
          border: `1px solid ${notification.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`,
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.9rem',
          fontWeight: '700',
          animation: 'fadeIn 0.25s ease'
        }}>
          {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* High Quality Hero LCP Background Image */}
      <img 
        src="/assets/hero_bg.jpg" 
        alt="bitessaludable comida real y viandas en Santa Rosa La Pampa"
        fetchPriority="high"
        loading="eager"
        decoding="sync"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1,
          filter: 'brightness(0.9)'
        }}
      />

      {/* Dark & Gradient Overlay for Perfect Legibility */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(28, 40, 38, 0.72) 0%, rgba(28, 40, 38, 0.55) 50%, rgba(250, 247, 242, 0.95) 100%)',
          zIndex: 2
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3, padding: '4rem 1.5rem', textAlign: 'center' }}>
        
        {/* Admin Edit Trigger Button */}
        {isAdminLoggedIn && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={handleOpenEditModal}
              className="btn btn-primary"
              style={{
                background: 'rgba(30, 130, 134, 0.95)',
                color: '#ffffff',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                padding: '0.65rem 1.35rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '800',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                border: '1.5px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease'
              }}
              title="Editar título y descripción de la portada (Modo Administrador)"
            >
              <Edit3 size={16} /> Modificar Título & Descripción
            </button>
          </div>
        )}

        {/* Subtitle / Brand Pills */}
        <div 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(252, 228, 214, 0.95)',
            color: '#8C4318',
            fontSize: '0.875rem',
            fontWeight: '700',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.15)'
          }}
          className="animate-fade-in"
        >
          <Sparkles size={16} color="var(--color-primary)" />
          <span>{heroData.badge || 'Comida Real • 100% Nutritiva & Deliciosa'}</span>
        </div>

        {/* Main Headline */}
        <h1 
          style={{
            fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.2rem)',
            color: '#ffffff',
            fontWeight: '800',
            lineHeight: 1.15,
            maxWidth: '900px',
            margin: '0 auto 1.25rem auto',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          {heroData.title}
        </h1>

        {/* Lead Paragraph */}
        <p 
          style={{
            fontSize: 'clamp(1.1rem, 1.5vw + 0.5rem, 1.35rem)',
            color: 'rgba(255, 255, 255, 0.92)',
            maxWidth: '720px',
            margin: '0 auto 2.25rem auto',
            fontWeight: '400',
            lineHeight: 1.6,
            textShadow: '0 2px 10px rgba(0,0,0,0.4)'
          }}
        >
          {heroData.description}
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <a href="#productos" className="btn btn-primary" style={{ fontSize: '1.05rem', padding: '1rem 2.25rem' }}>
            Explorar Menú Estrella <ArrowRight size={20} />
          </a>
          <a href="#historia" className="btn btn-secondary" style={{ fontSize: '1.05rem', padding: '1rem 2.25rem' }}>
            Nuestra Historia <Heart size={18} color="var(--color-primary)" />
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            maxWidth: '950px',
            margin: '0 auto'
          }}
        >
          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '50%', background: 'rgba(30, 130, 134, 0.12)' }}>
              <ShieldCheck size={22} color="var(--color-primary)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>100% Orgánico</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ingredientes seleccionados</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '50%', background: 'rgba(42, 82, 53, 0.12)' }}>
              <Sparkles size={22} color="var(--color-secondary)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Elaboración Diaria</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frescura garantizada</div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ padding: '0.6rem', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)' }}>
              <Clock size={22} color="var(--color-accent)" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>Envíos Rápidos</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Directo a tu mesa u oficina</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal interactivo de Edición para Administrador */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(20, 30, 28, 0.75)',
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '620px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.725rem' }}>
                  MODO ADMINISTRADOR
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0.25rem 0 0 0' }}>
                  Modificar Título & Descripción Principal
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Form */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Etiqueta / Badge */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
                  Etiqueta Superior (Badge)
                </label>
                <input 
                  type="text"
                  value={editBadge}
                  onChange={(e) => setEditBadge(e.target.value)}
                  placeholder="Ej: Comida Real • 100% Nutritiva & Deliciosa"
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Título Principal */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
                  Título Principal *
                </label>
                <textarea 
                  rows={3}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Nutrición Consciente que Nutre tu Cuerpo y Alegra tu Día"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Descripción / Párrafo */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
                  Descripción / Párrafo Explicativo *
                </label>
                <textarea 
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="En bitessaludable elaboramos productos nutritivos..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              background: '#f8fafc',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
              >
                Cancelar
              </button>

              <button 
                onClick={handleSaveHero}
                className="btn btn-primary"
                style={{
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
