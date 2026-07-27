import React from 'react';
import { Heart, Instagram, Phone, MapPin, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--text-dark)', color: '#ffffff', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.25rem' }}>
              <img 
                src="/assets/logo_original.jpg" 
                alt="bitessaludable logo" 
                style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid var(--color-primary-light)' }} 
              />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: '800', fontSize: '1.5rem', color: '#ffffff' }}>
                bites<span style={{ color: 'var(--color-primary-light)' }}>saludable</span>
              </span>
            </div>

            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Comida real, fresca y deliciosa elaborada con amor para nutrir tu cuerpo todos los días. Viandas, bowls y snacks orgánicos sin conservantes.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
              <a 
                href="https://www.instagram.com/bitessaludable/" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  height: '38px',
                  padding: '0 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--color-peach)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  transition: 'background 0.2s'
                }}
              >
                <Instagram size={18} /> @bitessaludable
              </a>

              <a 
                href="https://wa.me/5492954556820" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  height: '38px',
                  padding: '0 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#10B981',
                  fontWeight: '700',
                  fontSize: '0.85rem'
                }}
              >
                <Phone size={16} /> WhatsApp Directo
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1.25rem', fontWeight: '700' }}>
              Navegación
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="#hero" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Inicio</a></li>
              <li><a href="#productos" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Productos Estrella</a></li>
              <li><a href="#historia" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Nuestra Historia</a></li>
              <li><a href="#creadoras" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'none' }}>Las Creadoras</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '1.25rem', fontWeight: '700' }}>
              Contacto & Pedidos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={16} color="var(--color-primary-light)" />
                <a href="https://wa.me/5492954556820" target="_blank" rel="noreferrer" style={{ color: 'inherit', fontWeight: '600' }}>
                  +54 9 2954 556820
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Instagram size={16} color="var(--color-primary-light)" />
                <a href="https://www.instagram.com/bitessaludable/" target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                  @bitessaludable
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--color-primary-light)" /> Santa Rosa, La Pampa, Argentina
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Clock size={16} color="var(--color-primary-light)" /> Lunes a Sábado: 8:00 hs - 20:00 hs
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div style={{ textAlign: 'center', paddingTop: '2rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          © {new Date().getFullYear()} <strong>bitessaludable</strong>. Todos los derechos reservados. Diseñado con <Heart size={12} color="#EF4444" style={{ display: 'inline', margin: '0 2px' }} /> para una vida sana.
        </div>
      </div>
    </footer>
  );
}
