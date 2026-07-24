import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Database, Sparkles, Leaf } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function Navbar({ cartCount, onOpenCart }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stitchStatus, setStitchStatus] = useState({ connected: true, mode: 'Stitch Sync' });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    setStitchStatus(stitchService.getStatus());
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(250, 247, 242, 0.92)' : 'rgba(250, 247, 242, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: isScrolled ? '1px solid rgba(30, 130, 134, 0.15)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        padding: isScrolled ? '0.75rem 0' : '1.1rem 0'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand Logo & Title */}
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', textDecoration: 'none' }}>
          <img 
            src="/assets/logo_original.jpg" 
            alt="bitessaludable logo" 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-primary-light)',
              boxShadow: '0 2px 8px rgba(30, 130, 134, 0.2)'
            }} 
          />
          <div>
            <div style={{ 
              fontFamily: 'var(--font-heading)', 
              fontWeight: '800', 
              fontSize: '1.45rem', 
              letterSpacing: '-0.5px',
              color: 'var(--text-dark)',
              lineHeight: 1
            }}>
              bites<span style={{ color: 'var(--color-primary)' }}>saludable</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Leaf size={10} color="var(--color-secondary-light)" /> Alimentación Consciente
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
          <a href="#hero" className="nav-link">Inicio</a>
          <a href="#productos" className="nav-link">Productos</a>
          <a href="#historia" className="nav-link">Nuestra Historia</a>
          <a href="#creadoras" className="nav-link">Las Creadoras</a>
        </nav>

        {/* Action Controls (Stitch Badge + Cart Button + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Stitch Integration Status Badge */}
          <div 
            title="Stitch Backend Synchronized"
            style={{
              display: 'none',
              smDisplay: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(30, 130, 134, 0.08)',
              border: '1px solid rgba(30, 130, 134, 0.2)',
              fontSize: '0.75rem',
              color: 'var(--color-primary-dark)',
              fontWeight: '600'
            }}
            className="stitch-badge-nav"
          >
            <Database size={13} color="var(--color-primary)" />
            <span>Stitch Connected</span>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
          </div>

          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            aria-label="Ver Carrito de Compras"
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary)',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(30, 130, 134, 0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShoppingBag size={18} />
            <span style={{ display: 'none', smDisplay: 'inline' }}>Pedido</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'var(--color-accent)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '700',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Abrir menú"
            style={{ padding: '0.5rem', color: 'var(--text-dark)' }}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          style={{
            background: 'var(--bg-cream)',
            borderBottom: '1px solid var(--border-light)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <a href="#hero" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '600' }}>Inicio</a>
          <a href="#productos" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '600' }}>Productos</a>
          <a href="#historia" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '600' }}>Nuestra Historia</a>
          <a href="#creadoras" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '1.1rem', fontWeight: '600' }}>Las Creadoras</a>
        </div>
      )}

      <style>{`
        .nav-link {
          font-weight: 600;
          color: var(--text-dark);
          transition: color 0.2s ease;
          font-size: 0.95rem;
        }
        .nav-link:hover {
          color: var(--color-primary);
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .stitch-badge-nav { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
