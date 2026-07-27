import React, { useState, useEffect } from 'react';
import { X, Lock, ShieldAlert, Eye, EyeOff, ShieldCheck, KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { isSuperAdminPassword, verifyAdminPassword, getRecoveryEmail, saveNewAdminPassword } from '../utils/securityUtils';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [honeypot, setHoneypot] = useState('');

  // Estados de recuperación
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmailInput, setRecoveryEmailInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION_SEC = 900; // 15 minutos de bloqueo tras intentos fallidos

  useEffect(() => {
    if (!isOpen) return;

    // Recuperar intentos e historial de bloqueos de seguridad
    const savedAttempts = Number(sessionStorage.getItem('admin_login_attempts') || 0);
    const savedLockout = Number(sessionStorage.getItem('admin_login_lockout') || 0);
    const now = Math.floor(Date.now() / 1000);

    if (savedLockout > now) {
      const remaining = savedLockout - now;
      setLockoutTime(remaining);
      setError(`Acceso bloqueado por seguridad. Reintenta en ${Math.ceil(remaining / 60)} minutos.`);
    } else {
      if (savedLockout !== 0) {
        sessionStorage.removeItem('admin_login_lockout');
        sessionStorage.setItem('admin_login_attempts', '0');
      }
      setAttempts(savedAttempts);
      setLockoutTime(0);
      setError('');
    }
  }, [isOpen]);

  // Contador decreciente del tiempo de bloqueo
  useEffect(() => {
    let timer;
    if (lockoutTime > 0) {
      timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            sessionStorage.removeItem('admin_login_lockout');
            sessionStorage.setItem('admin_login_attempts', '0');
            setAttempts(0);
            setError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutTime]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Trap anti-bot honeypot
    if (honeypot.trim() !== '') {
      setError('Acceso denegado.');
      return;
    }

    // 1. Verificar si es la Clave Maestra de SuperAdmin / Desarrollador (Bypass de bloqueo)
    const isSuperAdmin = await isSuperAdminPassword(password);
    if (isSuperAdmin) {
      sessionStorage.removeItem('admin_login_attempts');
      sessionStorage.removeItem('admin_login_lockout');
      setAttempts(0);
      setPassword('');
      onLoginSuccess();
      onClose();
      return;
    }

    // Si está bloqueado y no es SuperAdmin
    if (lockoutTime > 0) {
      setError(`Acceso bloqueado por seguridad. Reintenta en ${Math.ceil(lockoutTime / 60)} minutos.`);
      return;
    }

    // 2. Verificar contraseña normal del Admin contra hash SHA-256
    const isValidAdmin = await verifyAdminPassword(password);

    if (isValidAdmin) {
      // Éxito: limpiar contadores de intento
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
        setError(`Demasiados intentos fallidos. Panel bloqueado por 15 minutos por protección de datos.`);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setError(`Contraseña incorrecta. Te quedan ${remaining} intento(s) antes del bloqueo.`);
      }
    }
  };

  // Manejador de recuperación por email
  const handleVerifyEmail = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const registeredEmail = getRecoveryEmail();
    const inputClean = recoveryEmailInput.trim().toLowerCase();

    if (!registeredEmail) {
      setError('No se ha configurado un correo de recuperación aún. Si eres el desarrollador, usa tu Clave Maestra.');
      return;
    }

    if (inputClean === registeredEmail) {
      setIsEmailVerified(true);
      setSuccessMsg('Correo de recuperación verificado. Ingresa tu nueva contraseña privada.');
    } else {
      setError('El correo ingresado no coincide con el registrado.');
    }
  };

  // Manejador de restablecimiento de contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPasswordInput.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    await saveNewAdminPassword(newPasswordInput);
    setSuccessMsg('¡Contraseña restablecida exitosamente! Ya puedes iniciar sesión.');
    setIsRecoveryMode(false);
    setIsEmailVerified(false);
    setPassword('');
    setRecoveryEmailInput('');
    setNewPasswordInput('');
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
        padding: '1rem',
        background: 'rgba(20, 30, 28, 0.8)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          background: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          border: '1px solid var(--border-light)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.4rem 1.5rem',
          background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={24} color="#ffffff" />
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#ffffff', fontWeight: '800', margin: 0 }}>
                {isRecoveryMode ? 'Recuperar Contraseña' : 'Acceso Administrador'}
              </h3>
              <p style={{ fontSize: '0.75rem', opacity: 0.85, margin: 0 }}>
                {isRecoveryMode ? 'Validación por Correo Seguro' : 'Protección de datos privada (SHA-256)'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
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
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.25rem'
            }}>
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{error}</div>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-sm)',
              background: '#D1FAE5',
              border: '1px solid #6EE7B7',
              color: '#065F46',
              fontSize: '0.85rem',
              fontWeight: '600',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{successMsg}</div>
            </div>
          )}

          {lockoutTime > 0 && !isRecoveryMode && (
            <div style={{
              textAlign: 'center',
              padding: '1rem',
              background: 'var(--bg-cream)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1.25rem',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                Tiempo restante de bloqueo
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#EF4444', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                {formatTime(lockoutTime)}
              </div>
            </div>
          )}

          {/* MODO NORMAL DE LOGIN */}
          {!isRecoveryMode ? (
            <form onSubmit={handleSubmit}>
              {/* Honeypot invisible */}
              <input 
                type="text"
                name="admin_login_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none', position: 'absolute', left: '-9999px' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                  Contraseña de Seguridad
                </label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Ingresa tu clave de acceso"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.8rem 0.75rem 1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '0.8rem',
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
              </div>

              {/* Botón de Olvidaste tu contraseña */}
              <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(true);
                    setError('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
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
                  className="btn btn-primary"
                  style={{ flex: 1.5, padding: '0.75rem' }}
                >
                  Ingresar al Panel
                </button>
              </div>
            </form>
          ) : (
            /* MODO DE RECUPERACIÓN POR CORREO */
            <div>
              {!isEmailVerified ? (
                <form onSubmit={handleVerifyEmail}>
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                      Correo Electrónico de Recuperación *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="email"
                        required
                        placeholder="tu-correo@ejemplo.com"
                        value={recoveryEmailInput}
                        onChange={(e) => setRecoveryEmailInput(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 2.6rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.95rem',
                          outline: 'none'
                        }}
                      />
                      <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      type="button"
                      onClick={() => setIsRecoveryMode(false)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <ArrowLeft size={16} /> Volver
                    </button>
                    <button 
                      type="submit"
                      className="btn btn-primary"
                      style={{ flex: 1.5, padding: '0.75rem' }}
                    >
                      Verificar Correo
                    </button>
                  </div>
                </form>
              ) : (
                /* RESTABLECER NUEVA CLAVE */
                <form onSubmit={handleResetPassword}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                      Nueva Contraseña *
                    </label>
                    <input 
                      type="password"
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--border-light)',
                        fontSize: '0.95rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
                  >
                    Guardar Nueva Contraseña Cifrada
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
