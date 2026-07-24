import React from 'react';
import { Heart, Instagram, Phone, Mail, MapPin, Clock, Leaf } from 'lucide-react';

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

            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-peach)',
                  transition: 'background 0.2s'
                }}
              >
                <Instagram size={18} />
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
                <Phone size={16} color="var(--color-primary-light)" /> +54 9 11 0000-0000
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={16} color="var(--color-primary-light)" /> hola@bitessaludable.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={16} color="var(--color-primary-light)" /> Buenos Aires, Argentina
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
