import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, Send, CheckCircle2, AlertTriangle } from 'lucide-react';
import { stitchService } from '../services/stitchService';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);
  const [securityError, setSecurityError] = useState('');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Sanitización de entradas contra inyecciones XSS / scripts
  const sanitizeText = (str) => {
    if (!str) return '';
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
  };

  const handleCheckoutWhatsApp = async (e) => {
    e.preventDefault();
    setSecurityError('');

    if (cartItems.length === 0) return;

    // 1. Honeypot check (si un bot completó el campo oculto)
    if (honeypot.trim() !== '') {
      console.warn('Bot de spam detectado por Honeypot.');
      setSecurityError('Error al procesar la solicitud.');
      return;
    }

    // 2. Anti-Spam / Rate Limiting (Máximo 3 pedidos cada 5 minutos por sesión)
    const now = Math.floor(Date.now() / 1000);
    const recentOrders = JSON.parse(sessionStorage.getItem('recent_orders_timestamps') || '[]');
    const validOrders = recentOrders.filter(t => now - t < 300); // 300 segundos = 5 min

    if (validOrders.length >= 3) {
      setSecurityError('Has realizado varios pedidos recientemente. Por favor espera unos minutos antes de realizar otro.');
      return;
    }

    // Sanitizar datos
    const cleanName = sanitizeText(customerName) || 'Cliente bitessaludable';
    const cleanAddress = sanitizeText(address);
    const cleanNotes = sanitizeText(notes);

    setIsSubmitting(true);

    const orderData = {
      customerName: cleanName,
      address: cleanAddress,
      notes: cleanNotes,
      items: cartItems,
      totalAmount,
      status: 'Pendiente'
    };

    try {
      // Registrar timestamp para rate limiting
      validOrders.push(now);
      sessionStorage.setItem('recent_orders_timestamps', JSON.stringify(validOrders));

      // Registrar en Stitch Database
      const res = await stitchService.submitOrder(orderData);

      // Formatear mensaje para WhatsApp
      let message = `*NUEVO PEDIDO - bitessaludable*\n`;
      message += `📋 *Orden ID:* ${res.orderId}\n`;
      message += `👤 *Cliente:* ${cleanName}\n`;
      if (cleanAddress) message += `📍 *Dirección:* ${cleanAddress}\n`;
      if (cleanNotes) message += `📝 *Notas:* ${cleanNotes}\n`;
      message += `\n*Detalle del Pedido:*\n`;

      cartItems.forEach(item => {
        message += `• ${item.quantity}x ${item.title} ($${(item.price * item.quantity).toLocaleString('es-AR')})\n`;
      });

      message += `\n*TOTAL:* $${totalAmount.toLocaleString('es-AR')} ARS\n`;
      message += `\n¡Gracias por elegir bitessaludable! 🌿`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/5491100000000?text=${encodedMessage}`;

      setIsSubmitting(false);
      setOrderComplete(res.orderId);

      // Abrir WhatsApp en una pestaña nueva
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      setIsSubmitting(false);
      setSecurityError('Ocurrió un error al procesar el pedido. Intenta nuevamente.');
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3000,
        display: 'flex',
        justifyContent: 'flex-end',
        background: 'rgba(28, 40, 38, 0.65)',
        backdropFilter: 'blur(6px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#ffffff',
          boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div 
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-cream)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-dark)' }}>Tu Pedido Saludable</h3>
          </div>

          <button 
            onClick={onClose}
            aria-label="Cerrar carrito"
            style={{ padding: '0.4rem', borderRadius: '50%', color: 'var(--text-muted)' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Order Success State */}
        {orderComplete ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', margin: 'auto' }}>
            <CheckCircle2 size={60} color="var(--color-primary)" style={{ margin: '0 auto 1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>¡Pedido Enviado!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Tu orden <strong style={{ color: 'var(--color-primary-dark)' }}>{orderComplete}</strong> se ha registrado en Stitch Database y redirigido a WhatsApp para coordinar la entrega.
            </p>
            <button 
              onClick={() => {
                setOrderComplete(null);
                onClearCart();
                onClose();
              }}
              className="btn btn-primary"
            >
              Realizar Otro Pedido
            </button>
          </div>
        ) : (
          <>
            {/* Drawer Body (Item list) */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} color="var(--text-light)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>Tu carrito está vacío</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Agrega tus platos saludables favoritos de nuestro menú.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {cartItems.map(item => (
                    <div 
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '0.85rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-cream)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.title}
                        style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} 
                      />

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-dark)' }}>{item.title}</h4>
                          <button 
                            onClick={() => onRemoveItem(item.id)}
                            style={{ color: '#EF4444', padding: '2px' }}
                            title="Eliminar producto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: '700', color: 'var(--color-primary-dark)', fontSize: '0.95rem' }}>
                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                          </span>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', borderRadius: 'var(--radius-full)', padding: '0.2rem 0.5rem', border: '1px solid var(--border-light)' }}>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} style={{ padding: '2px' }}>
                              <Minus size={14} />
                            </button>
                            <span style={{ fontWeight: '700', fontSize: '0.85rem', minWidth: '18px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{ padding: '2px' }}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Checkout Form */}
            {cartItems.length > 0 && (
              <div 
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid var(--border-light)',
                  background: '#ffffff',
                  boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
                }}
              >
                {securityError && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginBottom: '1rem'
                  }}>
                    <AlertTriangle size={16} />
                    <span>{securityError}</span>
                  </div>
                )}

                <form onSubmit={handleCheckoutWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  {/* Honeypot invisible para trampa anti-bot */}
                  <input 
                    type="text" 
                    name="website_url_hp"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                    tabIndex={-1}
                    autocomplete="off"
                  />

                  <input 
                    type="text"
                    placeholder="Tu nombre completo *"
                    required
                    maxLength={60}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
                  />
                  <input 
                    type="text"
                    placeholder="Dirección de entrega (Opcional)"
                    maxLength={100}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.9rem', outline: 'none' }}
                  />
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-dark)' }}>Total a Pagar:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary-dark)' }}>
                    ${totalAmount.toLocaleString('es-AR')} ARS
                  </span>
                </div>

                <button 
                  onClick={handleCheckoutWhatsApp}
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '1rem' }}
                >
                  <Send size={18} /> {isSubmitting ? 'Procesando en Stitch...' : 'Enviar Pedido por WhatsApp'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
