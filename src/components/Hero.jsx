import React from 'react';
import { ArrowRight, Sparkles, Heart, ShieldCheck, Clock } from 'lucide-react';

export default function Hero() {
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
      {/* High Quality Hero Background Image */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/assets/hero_bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
          <span>Comida Real • 100% Nutritiva & Deliciosa</span>
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
          Nutrición Consciente que Nutre tu Cuerpo y Alegra tu Día
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
          En <strong style={{ color: 'var(--color-peach)', fontWeight: '700' }}>bitessaludable</strong> elaboramos bowls nutritivos, meal preps equilibrados y snacks artesanales sin conservantes, hechos con ingredientes frescos de la más alta calidad.
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
    </section>
  );
}
