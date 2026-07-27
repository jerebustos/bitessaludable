import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Leaf, Shield, Lock } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function Navbar({ cartCount, onOpenCart, isAdminLoggedIn, onOpenAdminLogin, onOpenAdminPanel }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-container">
        {/* Brand Logo & Title */}
        <a href="#hero" className="navbar-brand">
          <img 
            src="/assets/logo_original.jpg" 
            alt="bitessaludable logo" 
            className="navbar-logo-img"
          />
          <div className="navbar-brand-text">
            <div className="navbar-brand-title">
              bites<span>saludable</span>
            </div>
            <div className="navbar-brand-sub">
              <Leaf size={10} color="var(--color-secondary-light)" /> Alimentación Consciente
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <a href="#hero" className="nav-link">Inicio</a>
          <a href="#productos" className="nav-link">Productos</a>
          <a href="#historia" className="nav-link">Nuestra Historia</a>
          <a href="#creadoras" className="nav-link">Las Creadoras</a>
        </nav>

        {/* Action Controls */}
        <div className="navbar-actions">
          {/* Admin Access Button */}
          {isAdminLoggedIn ? (
            <button
              onClick={onOpenAdminPanel}
              className="admin-btn logged-in"
              title="Abrir Panel de Administración"
            >
              <Shield size={16} />
              <span className="admin-btn-label">Panel Admin</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="admin-btn logged-out"
              title="Ingresar como Administrador"
            >
              <Lock size={15} color="var(--color-primary)" />
              <span className="admin-btn-label">Admin</span>
            </button>
          )}

          {/* Cart Button */}
          <button 
            onClick={onOpenCart}
            className="cart-btn"
            aria-label="Ver Carrito de Compras"
          >
            <ShoppingBag size={18} />
            <span className="cart-btn-label">Pedido</span>
            {cartCount > 0 && (
              <span className="cart-count-badge">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-toggle"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-menu">
          <a href="#hero" onClick={() => setMobileMenuOpen(false)}>Inicio</a>
          <a href="#productos" onClick={() => setMobileMenuOpen(false)}>Productos</a>
          <a href="#historia" onClick={() => setMobileMenuOpen(false)}>Nuestra Historia</a>
          <a href="#creadoras" onClick={() => setMobileMenuOpen(false)}>Las Creadoras</a>
          <div className="mobile-drawer-admin">
            {isAdminLoggedIn ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdminPanel(); }}
                className="mobile-admin-btn logged-in"
              >
                <Shield size={18} /> Panel de Administración
              </button>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
                className="mobile-admin-btn logged-out"
              >
                <Lock size={18} /> Ingresar como Administrador
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        .navbar-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          background: rgba(250, 247, 242, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: 0.85rem 0;
        }

        .navbar-header.scrolled {
          background: rgba(250, 247, 242, 0.95);
          border-bottom: 1px solid rgba(30, 130, 134, 0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
          padding: 0.6rem 0;
        }

        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          text-decoration: none;
          min-width: 0;
        }

        .navbar-logo-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary-light);
          box-shadow: 0 2px 8px rgba(30, 130, 134, 0.2);
          flex-shrink: 0;
        }

        .navbar-brand-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.15rem;
          letter-spacing: -0.4px;
          color: var(--text-dark);
          line-height: 1;
          white-space: nowrap;
        }

        .navbar-brand-title span {
          color: var(--color-primary);
        }

        .navbar-brand-sub {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 3px;
          margin-top: 2px;
          white-space: nowrap;
        }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 1.75rem;
        }

        .nav-link {
          font-weight: 600;
          color: var(--text-dark);
          transition: color 0.2s ease;
          font-size: 0.95rem;
        }

        .nav-link:hover {
          color: var(--color-primary);
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
        }

        .admin-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.45rem 0.65rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .admin-btn.logged-in {
          background: linear-gradient(135deg, #065F46 0%, #10B981 100%);
          color: #ffffff;
          border: none;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
        }

        .admin-btn.logged-out {
          background: rgba(30, 41, 59, 0.06);
          color: var(--text-dark);
          border: 1px solid var(--border-light);
        }

        .cart-btn {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.45rem 0.75rem;
          border-radius: var(--radius-full);
          background: var(--color-primary);
          color: #ffffff;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          box-shadow: 0 3px 10px rgba(30, 130, 134, 0.3);
          white-space: nowrap;
          border: none;
          cursor: pointer;
        }

        .cart-btn:hover {
          transform: scale(1.04);
        }

        .cart-count-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--color-accent);
          color: #fff;
          font-size: 0.7rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem;
          color: var(--text-dark);
          border-radius: var(--radius-sm);
          background: none;
          border: none;
          cursor: pointer;
        }

        .cart-btn-label, .admin-btn-label {
          display: none;
        }

        .mobile-drawer-menu {
          background: var(--bg-cream);
          border-bottom: 1px solid var(--border-light);
          padding: 1.25rem 1.5rem;
          display: flex;
          flexDirection: column;
          gap: 0.85rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          animation: fadeIn 0.2s ease;
        }

        .mobile-drawer-menu a {
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--text-dark);
          padding: 0.3rem 0;
        }

        .mobile-drawer-admin {
          border-top: 1px solid var(--border-light);
          padding-top: 0.75rem;
          margin-top: 0.25rem;
        }

        .mobile-admin-btn {
          width: 100%;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
        }

        .mobile-admin-btn.logged-in {
          background: #10B981;
          color: #ffffff;
        }

        .mobile-admin-btn.logged-out {
          background: #ffffff;
          color: var(--text-dark);
          border: 1px solid var(--border-light);
        }

        /* Responsive Breakpoints */
        @media (min-width: 480px) {
          .navbar-logo-img {
            width: 42px;
            height: 42px;
          }
          .navbar-brand-title {
            font-size: 1.3rem;
          }
          .cart-btn-label {
            display: inline;
          }
          .cart-btn {
            padding: 0.5rem 1rem;
          }
        }

        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .admin-btn-label {
            display: inline;
          }
          .admin-btn {
            padding: 0.55rem 0.9rem;
          }
          .navbar-actions {
            gap: 0.75rem;
          }
          .navbar-logo-img {
            width: 46px;
            height: 46px;
          }
          .navbar-brand-title {
            font-size: 1.45rem;
          }
          .navbar-brand-sub {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </header>
  );
}
