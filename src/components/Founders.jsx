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
            className="glass-card founders-card"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
              width: '100%'
            }}
          >
            {/* Founders Photo Container */}
            <div style={{ position: 'relative', width: '100%' }}>
              <div 
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '3px solid var(--color-primary-light)',
                  boxShadow: '0 8px 24px rgba(30, 130, 134, 0.15)',
                  width: '100%'
                }}
              >
                <img 
                  src={founder.photo} 
                  alt={founder.name}
                  className="founders-img"
                  style={{ 
                    width: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center 20%',
                    display: 'block',
                    filter: 'brightness(1.05) contrast(1.06) saturate(1.08)'
                  }}
                />
              </div>

              {/* Floating Badge */}
              <div 
                className="founders-badge"
                style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '10px',
                  background: 'var(--color-primary)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(30, 130, 134, 0.4)'
                }}
              >
                <Sparkles size={14} /> Fundadoras & Chefs
              </div>
            </div>

            {/* Founder Biography & Quote */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', width: '100%' }}>
              <div>
                <span className="badge badge-peach" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                  {founder.role}
                </span>
                <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text-dark)', fontWeight: '800' }}>
                  {founder.name}
                </h3>
              </div>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.65 }}>
                {founder.bio}
              </p>

              {/* Inverted Quote Box */}
              <div 
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(30, 130, 134, 0.06)',
                  borderLeft: '4px solid var(--color-primary)',
                  position: 'relative'
                }}
              >
                <Quote size={20} color="var(--color-primary)" style={{ opacity: 0.3, marginBottom: '0.2rem' }} />
                <p style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(1.15rem, 2.5vw, 1.45rem)',
                  color: 'var(--color-primary-dark)',
                  lineHeight: 1.35,
                  fontWeight: '600'
                }}>
                  "{founder.quote}"
                </p>
              </div>

              {/* Key Pillars */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-secondary)' }}>
                  <Leaf size={15} /> Nutrición Holística
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-primary-dark)' }}>
                  <Heart size={15} /> Amor por la Cocina
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', fontWeight: '600', color: 'var(--color-accent)' }}>
                  <Award size={15} /> Insumos Locales
                </div>
              </div>

            </div>

          </div>
        ))}

      </div>

      <style>{`
        .founders-card {
          padding: 1.5rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }
        .founders-img {
          height: 280px;
        }
        @media (min-width: 768px) {
          .founders-card {
            padding: 2.5rem;
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .founders-img {
            height: 380px;
          }
          .founders-badge {
            bottom: -15px;
            right: 15px;
            padding: 0.6rem 1.25rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}
