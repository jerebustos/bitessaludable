import React from 'react';
import { PackageCheck, ShoppingBag, Sparkles, Send, CheckCircle2, ShieldCheck, Truck, Award } from 'lucide-react';

export default function WholesaleSection() {
  const whatsappUrl = `https://wa.me/5492954395446?text=${encodeURIComponent('Hola! Me interesa solicitar información y catálogo de precios para pedidos al por mayor de bitessaludable.')}`;

  return (
    <section id="mayorista" style={{ padding: '5.5rem 0 6rem 0', background: 'linear-gradient(180deg, var(--bg-cream) 0%, #F4EBE1 100%)', position: 'relative' }}>
      <div className="container">
        
        {/* Header Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem auto' }}>
          <div className="badge badge-secondary" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <PackageCheck size={14} /> Envíos & Distribución
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-dark)', marginBottom: '1rem', fontWeight: '800' }}>
            Pedidos al Por Mayor
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Abastecé tu dietética, café, gimnasio o evento con la línea completa de galletitas, snacks fit y alimentos saludables artesanales de <strong>bitessaludable</strong>. Envasados de primera calidad, listos para góndola y revendedores.
          </p>
        </div>

        {/* Wholesale Card */}
        <div 
          className="glass-card"
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            background: '#ffffff',
            border: '2px solid var(--color-primary-light)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
          }}
        >
          {/* Main Photo Container */}
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', background: '#2c3531' }}>
            <img 
              src="/assets/pedidos_mayorista.jpg" 
              alt="Pedidos al por mayor bitessaludable - Galletitas y Snacks saludables envasados"
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                maxHeight: '460px',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                filter: 'brightness(1.03) contrast(1.04)'
              }}
            />

            {/* Floating Banner Badge */}
            <div 
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                background: 'rgba(30, 130, 134, 0.92)',
                color: '#ffffff',
                backdropFilter: 'blur(6px)',
                padding: '0.6rem 1.25rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '800',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                border: '1.5px solid rgba(255,255,255,0.3)'
              }}
            >
              <Sparkles size={16} /> Venta Directa & Revendedores
            </div>
          </div>

          {/* Wholesale Details & Call to Action */}
          <div style={{ padding: '0 2rem 2.25rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            
            {/* Features Grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                background: 'rgba(30, 130, 134, 0.05)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(30, 130, 134, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '0.45rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0 }}>Envasado Profesional</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                    Bolsas herméticas transparentes con etiqueta oficial lista para góndola.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--color-secondary)', color: '#fff', padding: '0.45rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <Award size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0 }}>Descuentos por Volumen</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                    Precios competitivos adaptados para revendedores y comercios.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--color-primary-dark)', color: '#fff', padding: '0.45rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <Truck size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0 }}>Envíos Programados</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                    Entregas periódicas para asegurar frescura constante en tus productos.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--color-accent)', color: '#fff', padding: '0.45rem', borderRadius: '50%', display: 'flex', flexShrink: 0 }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-dark)', margin: 0 }}>100% Artesanales</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', lineHeight: 1.4 }}>
                    Elaborados diariamente con insumos seleccionados de primera calidad.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', pt: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-dark)', margin: 0 }}>
                  ¿Querés ofrecer bitessaludable en tu comercio?
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.25rem 0 0 0' }}>
                  Escribinos a nuestro WhatsApp mayorista (<strong style={{ color: 'var(--color-primary-dark)' }}>+54 9 2954 395446</strong>) para recibir el catálogo y lista de precios.
                </p>
              </div>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{
                  padding: '0.85rem 1.6rem',
                  fontSize: '0.95rem',
                  fontWeight: '800',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 6px 20px rgba(30, 130, 134, 0.3)',
                  textDecoration: 'none'
                }}
              >
                <Send size={18} /> Consultar Catálogo Mayorista
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
