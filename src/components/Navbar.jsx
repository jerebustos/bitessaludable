import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { ShoppingBag, Menu, X, Leaf, Shield, Lock, Home, Utensils, BookOpen, Users, ChevronRight, MapPin, Sparkles } from 'lucide-react';

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

  // Bloquear el scroll del fondo cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Inicio', href: '#hero', icon: Home },
    { label: 'Productos', href: '#productos', icon: Utensils },
    { label: 'Nuestra Historia', href: '#historia', icon: BookOpen },
    { label: 'Las Creadoras', href: '#creadoras', icon: Users }
  ];

  return (
    <>
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

            {/* Mobile Hamburger Toggle Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-toggle"
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Renderizado mediante Portal en document.body para evitar trampas de z-index y backdrop-filter */}
      {typeof document !== 'undefined' && ReactDOM.createPortal(
        <>
          {/* Overlay Oscuro con Blur */}
          {mobileMenuOpen && (
            <div 
              className="mobile-menu-overlay" 
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Menú Desplegable Lateral Móvil */}
          <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
            {/* Cabecera del Menú Móvil */}
            <div className="mobile-drawer-header">
              <div className="mobile-drawer-brand">
                <img src="/assets/logo_original.jpg" alt="Logo" className="mobile-drawer-logo" />
                <div>
                  <div className="mobile-drawer-title">bites<span>saludable</span></div>
                  <div className="mobile-drawer-subtitle">Menú de Navegación</div>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="mobile-drawer-close"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            {/* Links de Navegación Móvil */}
            <div className="mobile-drawer-body">
              <div className="mobile-drawer-nav">
                {navLinks.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <a 
                      key={idx} 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="mobile-nav-link"
                    >
                      <div className="mobile-nav-icon">
                        <IconComp size={18} color="var(--color-primary)" />
                      </div>
                      <span className="mobile-nav-text">{item.label}</span>
                      <ChevronRight size={16} className="mobile-nav-arrow" />
                    </a>
                  );
                })}
              </div>

              {/* Tarjeta de Administración Móvil */}
              <div className="mobile-drawer-admin-box">
                <div className="mobile-admin-badge">
                  <Sparkles size={13} /> Gestión de Catálogo
                </div>
                {isAdminLoggedIn ? (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAdminPanel(); }}
                    className="mobile-admin-act-btn logged-in"
                  >
                    <Shield size={18} /> Abrir Panel Admin
                  </button>
                ) : (
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
                    className="mobile-admin-act-btn logged-out"
                  >
                    <Lock size={18} /> Acceso Administrador
                  </button>
                )}
              </div>
            </div>

            {/* Pie del Menú Móvil */}
            <div className="mobile-drawer-footer">
              <MapPin size={14} color="var(--color-primary)" />
              <span>Santa Rosa, La Pampa • Menú Fresco Diario</span>
            </div>
          </div>
        </>,
        document.body
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
          padding: 0.45rem;
          color: var(--text-dark);
          border-radius: var(--radius-full);
          background: rgba(30, 130, 134, 0.08);
          border: 1px solid var(--border-light);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .mobile-toggle:hover, .mobile-toggle:active {
          background: rgba(30, 130, 134, 0.15);
          color: var(--color-primary-dark);
        }

        .cart-btn-label, .admin-btn-label {
          display: none;
        }

        /* Backdrop Overlay para Menú Móvil (Renderizado fuera en document.body) */
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 20, 0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 99999;
          animation: fadeIn 0.25s ease;
        }

        /* Drawer Desplegable Móvil Lateral */
        .mobile-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 85%;
          max-width: 320px;
          background: #ffffff;
          z-index: 100000;
          display: flex;
          flex-direction: column;
          box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-drawer.open {
          transform: translateX(0);
        }

        /* Header del Drawer */
        .mobile-drawer-header {
          padding: 1.25rem 1.25rem 1rem 1.25rem;
          background: var(--bg-cream);
          border-bottom: 1px solid var(--border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-drawer-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .mobile-drawer-logo {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--color-primary-light);
        }

        .mobile-drawer-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 1.1rem;
          color: var(--text-dark);
          line-height: 1;
        }

        .mobile-drawer-title span {
          color: var(--color-primary);
        }

        .mobile-drawer-subtitle {
          font-size: 0.7rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .mobile-drawer-close {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dark);
          transition: all 0.2s ease;
          border: none;
        }

        .mobile-drawer-close:active {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        /* Body del Drawer */
        .mobile-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .mobile-drawer-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.85rem 1rem;
          border-radius: var(--radius-md);
          background: var(--bg-cream);
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .mobile-nav-link:active, .mobile-nav-link:hover {
          background: #ffffff;
          border-color: var(--border-light);
          box-shadow: 0 4px 12px rgba(30, 130, 134, 0.1);
          transform: translateX(4px);
        }

        .mobile-nav-icon {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          background: rgba(30, 130, 134, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-nav-text {
          flex: 1;
        }

        .mobile-nav-arrow {
          color: var(--text-light);
          transition: transform 0.2s ease;
        }

        .mobile-nav-link:hover .mobile-nav-arrow {
          transform: translateX(3px);
          color: var(--color-primary);
        }

        /* Sección Admin del Drawer */
        .mobile-drawer-admin-box {
          margin-top: auto;
          background: linear-gradient(135deg, rgba(30, 130, 134, 0.06) 0%, rgba(42, 82, 53, 0.06) 100%);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .mobile-admin-badge {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-primary-dark);
          display: flex;
          align-items: center;
          gap: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        .mobile-admin-act-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }

        .mobile-admin-act-btn.logged-in {
          background: linear-gradient(135deg, #065F46 0%, #10B981 100%);
          color: #ffffff;
        }

        .mobile-admin-act-btn.logged-out {
          background: #ffffff;
          color: var(--text-dark);
          border: 1px solid var(--border-light);
        }

        /* Footer del Drawer */
        .mobile-drawer-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid var(--border-light);
          background: var(--bg-cream);
          font-size: 0.75rem;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          text-align: center;
        }

        /* Breakpoints Responsivos */
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

        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
          .mobile-menu-overlay {
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
    </>
  );
}
