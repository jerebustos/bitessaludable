import React, { useState, useEffect } from 'react';
import { X, Lock, Key, ShieldCheck, AlertCircle, Eye, EyeOff, ShieldAlert, Clock } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [honeypot, setHoneypot] = useState(''); // Anti-bot honeypot field

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION_SEC = 300; // 5 minutos de bloqueo

  useEffect(() => {
    // Cargar estado de intentos previos
    const savedAttempts = Number(sessionStorage.getItem('admin_login_attempts') || 0);
    const savedLockout = Number(sessionStorage.getItem('admin_login_lockout') || 0);
    const now = Math.floor(Date.now() / 1000);

    setAttempts(savedAttempts);

    if (savedLockout > now) {
      setLockoutTime(savedLockout - now);
    }
  }, [isOpen]);

  // Temporizador decreciente de bloqueo
  useEffect(() => {
    if (lockoutTime <= 0) return;
    const interval = setInterval(() => {
      setLockoutTime(prev => {
        if (prev <= 1) {
          sessionStorage.removeItem('admin_login_lockout');
          sessionStorage.setItem('admin_login_attempts', '0');
          setAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutTime]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Si se completa el honeypot, es un bot
    if (honeypot.trim() !== '') {
      setError('Acceso denegado.');
      return;
    }

    if (lockoutTime > 0) {
      setError(`Acceso bloqueado por seguridad. Reintenta en ${lockoutTime} segundos.`);
      return;
    }

    const ADMIN_PASS = 'admin123';

    if (password === ADMIN_PASS) {
      // Exito: limpiar estado de seguridad
      sessionStorage.removeItem('admin_login_attempts');
      sessionStorage.removeItem('admin_login_lockout');
      setAttempts(0);
      setPassword('');
      onLoginSuccess();
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      sessionStorage.setItem('admin_login_attempts', String(newAttempts));

      if (newAttempts >= MAX_ATTEMPTS) {
        const until = Math.floor(Date.now() / 1000) + LOCKOUT_DURATION_SEC;
        sessionStorage.setItem('admin_login_lockout', String(until));
        setLockoutTime(LOCKOUT_DURATION_SEC);
        setError(`Demasiados intentos fallidos. Panel bloqueado por 5 minutos por seguridad.`);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(`Contraseña incorrecta. Te quedan ${remaining} intento(s) antes del bloqueo.`);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'rgba(20, 30, 28, 0.75)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.25s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-light)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con estilo elegante */}
        <div style={{
          background: lockoutTime > 0 
            ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)'
            : 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          padding: '2rem 1.5rem',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          transition: 'background 0.3s'
        }}>
          <button 
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>

          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto'
          }}>
            {lockoutTime > 0 ? <ShieldAlert size={30} color="#ffffff" /> : <ShieldCheck size={30} color="#ffffff" />}
          </div>

          <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '0.3rem' }}>
            Acceso Administrador
          </h3>
          <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
            {lockoutTime > 0 ? 'Sistema bloqueado temporalmente' : 'Ingresa tu clave de acceso con seguridad'}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ padding: '1.75rem 1.5rem' }}>
          {/* Honeypot invisible para trampa anti-bot */}
          <input 
            type="text" 
            name="username_hp"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            style={{ display: 'none', position: 'absolute', left: '-9999px' }}
            tabIndex={-1}
            autocomplete="off"
          />

          {lockoutTime > 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '1.5rem',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: 'var(--radius-md)',
              color: '#991B1B',
              marginBottom: '1.25rem'
            }}>
              <Clock size={32} style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontWeight: '800', fontSize: '1.2rem', marginBottom: '0.3rem' }}>
                {formatTime(lockoutTime)}
              </div>
              <p style={{ fontSize: '0.85rem' }}>
                Demasiados intentos fallidos. Espera a que finalice el tiempo de seguridad para intentar nuevamente.
              </p>
            </div>
          ) : error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1rem',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              Contraseña de Administración
            </label>
            <div style={{ position: 'relative' }}>
              <Lock 
                size={18} 
                color="var(--text-light)" 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} 
              />
              <input 
                type={showPassword ? 'text' : 'password'}
                placeholder="Ingresa la contraseña..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
                disabled={lockoutTime > 0}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.8rem 0.75rem 2.8rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  opacity: lockoutTime > 0 ? 0.6 : 1
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={lockoutTime > 0}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              * Clave predeterminada de prueba: <strong>admin123</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.75rem' }}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={lockoutTime > 0}
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.75rem', opacity: lockoutTime > 0 ? 0.6 : 1 }}
            >
              <Key size={16} /> Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

