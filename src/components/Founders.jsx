import React, { useState, useEffect } from 'react';
import { Users, Heart, Award, Sparkles, Quote, Leaf } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function Founders() {
  const [foundersInfo, setFoundersInfo] = useState([]);

  useEffect(() => {
    async function fetchFounders() {
      const data = await stitchService.getFounders();
      setFoundersInfo(data);
    }
    fetchFounders();
  }, []);

  return (
    <section id="creadoras" style={{ padding: '6rem 0', background: 'var(--bg-cream)', position: 'relative' }}>
      <div className="container">
        
        {/* Section Title Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3.5rem auto' }}>
          <div className="badge badge-secondary" style={{ marginBottom: '0.75rem' }}>
            <Users size={14} /> El Alma del Emprendimiento
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', color: 'var(--text-dark)', marginBottom: '1rem' }}>
            Las Creadoras de bitessaludable
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Detrás de cada bowl, vianda y jugo hay dos mentes apasionadas por la salud, el diseño gastronómico y el bienestar integral.
          </p>
        </div>

        {/* Founders Showcase Card */}
        {foundersInfo.map((founder) => (
          <div 
            key={founder.id}
            className="glass-card"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            {/* Founders Photo Container */}
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid var(--color-primary-light)',
                  boxShadow: '0 8px 24px rgba(30, 130, 134, 0.15)'
                }}
              >
                <img 
                  src={founder.photo} 
                  alt={founder.name}
                  style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Floating Badge */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: '-15px',
                  right: '15px',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.6rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(30, 130, 134, 0.4)'
                }}
              >
                <Sparkles size={16} /> Fundadoras & Chefs Saludables
              </div>
            </div>

            {/* Founder Biography & Quote */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span className="badge badge-peach" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                  {founder.role}
                </span>
                <h3 style={{ fontSize: '2rem', color: 'var(--text-dark)', fontWeight: '800' }}>
                  {founder.name}
                </h3>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '1.025rem', lineHeight: 1.7 }}>
                {founder.bio}
              </p>

              {/* Inverted Quote Box */}
              <div 
                style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(30, 130, 134, 0.06)',
                  borderLeft: '4px solid var(--color-primary)',
                  position: 'relative'
                }}
              >
                <Quote size={24} color="var(--color-primary)" style={{ opacity: 0.3, marginBottom: '0.25rem' }} />
                <p style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '1.45rem',
                  color: 'var(--color-primary-dark)',
                  lineHeight: 1.35,
                  fontWeight: '600'
                }}>
                  "{founder.quote}"
                </p>
              </div>

              {/* Key Pillars */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                  <Leaf size={16} /> Nutrición Holística
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                  <Heart size={16} /> Amor por la Cocina
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-accent)' }}>
                  <Award size={16} /> Insumos Locales
                </div>
              </div>

            </div>

          </div>
        ))}

      </div>
    </section>
  );
}
