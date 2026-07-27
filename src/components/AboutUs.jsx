import React from 'react';
import { Heart, Leaf, Award, Recycle, Sparkles } from 'lucide-react';

export default function AboutUs() {
  return (
    <section id="historia" style={{ padding: '6rem 0', background: 'var(--color-peach-light)', position: 'relative' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          
          {/* Brand Story Text Content */}
          <div>
            <div className="badge badge-peach" style={{ marginBottom: '0.85rem' }}>
              <Heart size={14} color="#8C4318" /> Nuestra Historia
            </div>
            
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-dark)', marginBottom: '1.25rem', lineHeight: 1.2 }}>
              Alimentar tu Vida con Amor, Frescura y Conciencia
            </h2>
            
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              <strong style={{ color: 'var(--color-primary-dark)' }}>bitessaludable</strong> nació del deseo de transformar la forma en que nos relacionamos con la comida diaria. Creemos firmemente que comer saludable no significa renunciar al sabor, a la variedad ni al placer de un plato lleno de color.
            </p>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Lo que comenzó como una búsqueda personal por hábitos más saludables en nuestra propia cocina, rápidamente se convirtió en un emprendimiento apasionado dedicado a preparar deliciosas opciones de Pastelería, Panificados, Pastas, Snacks & Dulces Fit y Box Gourmet elaborados desde cero cada mañana, con insumos 100% naturales y locales.
            </p>

            {/* Core Values Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(30, 130, 134, 0.12)', color: 'var(--color-primary)' }}>
                  <Leaf size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>100% Natural</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Sin ultraprocesados ni aditivos químicos.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(42, 82, 53, 0.12)', color: 'var(--color-secondary)' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>Calidad Premium</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Proteínas magras y vegetales frescos.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.12)', color: 'var(--color-accent)' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>Equilibrio Real</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Diseñado por especialistas en nutrición.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '0.5rem', borderRadius: '50%', background: 'rgba(30, 130, 134, 0.12)', color: 'var(--color-primary-dark)' }}>
                  <Recycle size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.2rem' }}>Eco-Friendly</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Empaques sustentables y reciclables.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Graphic / Banner Card */}
          <div style={{ position: 'relative' }}>
            <div 
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '4px solid #ffffff',
                position: 'relative'
              }}
            >
              <img 
                src="/assets/meal_prep_pack.jpg" 
                alt="Comida saludable bitessaludable"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 40%, rgba(28, 40, 38, 0.85) 100%)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  color: '#ffffff'
                }}
              >
                <div style={{ fontFamily: 'var(--font-script)', fontSize: '2.2rem', color: 'var(--color-peach)', lineHeight: 1.1 }}>
                  "Tu cuerpo es tu templo, nútrelo con amor"
                </div>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.5rem' }}>
                  — Filosofía bitessaludable
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
