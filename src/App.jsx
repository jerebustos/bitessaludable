import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGallery from './components/ProductGallery';
import AboutUs from './components/AboutUs';
import Founders from './components/Founders';
import WholesaleSection from './components/WholesaleSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanelModal from './components/AdminPanelModal';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Estados del Panel de Administración
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  useEffect(() => {
    // Comprobar si la sesión de admin estaba iniciada en la sesión actual
    const session = sessionStorage.getItem('bitessaludable_admin_session');
    if (session === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('bitessaludable_admin_session', 'true');
    setIsAdminPanelOpen(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('bitessaludable_admin_session');
    setIsAdminPanelOpen(false);
    setEditingProductId(null);
  };

  const handleOpenEditProduct = (product) => {
    if (!isAdminLoggedIn) {
      setIsAdminLoginOpen(true);
      return;
    }
    setEditingProductId(product.id);
    setIsAdminPanelOpen(true);
  };

  const handleCloseAdminPanel = () => {
    setIsAdminPanelOpen(false);
    setEditingProductId(null);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => setIsCartOpen(true)} 
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminPanel={() => {
          setEditingProductId(null);
          setIsAdminPanelOpen(true);
        }}
      />
      
      <main style={{ flex: 1 }}>
        <Hero isAdminLoggedIn={isAdminLoggedIn} />
        <ProductGallery 
          onAddToCart={handleAddToCart} 
          isAdminLoggedIn={isAdminLoggedIn}
          onOpenAdminPanel={() => {
            setEditingProductId(null);
            setIsAdminPanelOpen(true);
          }}
          onEditProduct={handleOpenEditProduct}
        />
        <AboutUs />
        <Founders isAdminLoggedIn={isAdminLoggedIn} />
        <WholesaleSection />
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Modal Login Administrador */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Modal Panel de Administración */}
      <AdminPanelModal 
        isOpen={isAdminPanelOpen}
        onClose={handleCloseAdminPanel}
        onLogout={handleAdminLogout}
        initialEditProductId={editingProductId}
      />
    </div>
  );
}
