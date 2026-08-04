import React, { useState, useEffect } from 'react';
import { Users, Heart, Award, Sparkles, Quote, Leaf, Edit3, Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { stitchService } from '../services/stitchService';

const compressImageFile = (file, maxWidth = 1000, quality = 0.82) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

export default function Founders({ isAdminLoggedIn }) {
  const [foundersInfo, setFoundersInfo] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [targetFounder, setTargetFounder] = useState(null);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    async function fetchFounders() {
      const data = await stitchService.getFounders();
      setFoundersInfo(data);
    }
    fetchFounders();

    const unsubscribe = stitchService.subscribeFounders((updatedData) => {
      setFoundersInfo(updatedData);
    });

    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenEditModal = (founder) => {
    setTargetFounder(founder);
    setNewPhotoUrl(founder.photo || '');
    setIsEditModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const compressedDataUrl = await compressImageFile(file, 1000, 0.82);
        if (compressedDataUrl) {
          setNewPhotoUrl(compressedDataUrl);
          showToast('¡Foto cargada y optimizada!');
        } else {
          showToast('No se pudo procesar la imagen.', 'error');
        }
      } catch (err) {
        showToast('Error al leer el archivo de imagen.', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSavePhoto = async () => {
    if (!newPhotoUrl) {
      showToast('Por favor selecciona una foto o ingresa una URL válida.', 'error');
      return;
    }

    try {
      setUploading(true);
      const founderId = targetFounder?.id || 'founder-1';
      await stitchService.updateFounderPhoto(founderId, newPhotoUrl);
      showToast('¡Foto de las Creadoras actualizada exitosamente!');
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error al guardar foto de las creadoras:', err);
      showToast('Error al guardar la nueva foto.', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <section id="creadoras" style={{ padding: '6rem 0', background: 'var(--bg-cream)', position: 'relative' }}>
      <div className="container">
        
        {/* Toast Notification Alert */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '5rem',
            right: '1.5rem',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.35rem',
            borderRadius: 'var(--radius-md)',
            background: notification.type === 'error' ? '#FEE2E2' : '#D1FAE5',
            color: notification.type === 'error' ? '#991B1B' : '#065F46',
            border: `1px solid ${notification.type === 'error' ? '#FCA5A5' : '#6EE7B7'}`,
            boxShadow: 'var(--shadow-lg)',
            fontSize: '0.9rem',
            fontWeight: '700',
            animation: 'fadeIn 0.25s ease'
          }}>
            {notification.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
            <span>{notification.message}</span>
          </div>
        )}

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
              width: '100%',
              position: 'relative'
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
                  alt={`${founder.name} - Fundadoras de bitessaludable en Santa Rosa La Pampa`}
                  loading="lazy"
                  decoding="async"
                  className="founders-img"
                  style={{ 
                    width: '100%', 
                    objectFit: 'cover', 
                    objectPosition: 'center 20%',
                    display: 'block',
                    filter: 'brightness(1.05) contrast(1.06) saturate(1.08)'
                  }}
                />

                {/* Botón de modificación con permisos de Administrador */}
                {isAdminLoggedIn && (
                  <button
                    onClick={() => handleOpenEditModal(founder)}
                    className="btn btn-primary"
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      zIndex: 10,
                      background: 'rgba(30, 130, 134, 0.92)',
                      color: '#ffffff',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                      padding: '0.6rem 1.1rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '800',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      border: '1.5px solid rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, background 0.2s ease'
                    }}
                    title="Modificar foto de las creadoras (Modo Administrador)"
                  >
                    <Edit3 size={16} /> Modificar
                  </button>
                )}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <span className="badge badge-peach" style={{ fontWeight: '700', marginBottom: '0.5rem' }}>
                    {founder.role}
                  </span>
                  <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--text-dark)', fontWeight: '800' }}>
                    {founder.name}
                  </h3>
                </div>

                {isAdminLoggedIn && (
                  <button
                    onClick={() => handleOpenEditModal(founder)}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.45rem 0.85rem',
                      fontSize: '0.8rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: '700'
                    }}
                  >
                    <Edit3 size={14} /> Modificar Foto
                  </button>
                )}
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

      {/* Modal de Modificación de Foto para Administrador */}
      {isEditModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            background: 'rgba(20, 30, 28, 0.75)',
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.2s ease'
          }}
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.5rem',
              background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.725rem' }}>
                  PERMISO DE ADMINISTRADOR
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '0.25rem 0 0 0' }}>
                  Modificar Foto de las Creadoras
                </h3>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
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

            {/* Modal Content */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Option 1: File Upload */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                  1. Seleccionar nueva foto desde tu dispositivo (PC / Celular)
                </label>
                <label 
                  className="btn btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    border: '2px dashed var(--color-primary-light)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '700',
                    color: 'var(--color-primary-dark)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Upload size={18} />
                  <span>{uploading ? 'Procesando foto...' : 'Elegir archivo de imagen...'}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  La foto se optimizará automáticamente antes de guardarse en el sistema.
                </p>
              </div>

              {/* Option 2: Image URL */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                  2. O ingresar URL de imagen externa
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="url"
                    placeholder="https://ejemplo.com/foto_creadoras.jpg"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-light)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
                  Vista previa de la nueva foto:
                </label>
                <div 
                  style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#f1f5f9',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {newPhotoUrl ? (
                    <img 
                      src={newPhotoUrl} 
                      alt="Vista previa creadoras"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={() => showToast('No se pudo cargar la imagen desde la URL ingresada.', 'error')}
                    />
                  ) : (
                    <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <ImageIcon size={32} opacity={0.4} />
                      <span style={{ fontSize: '0.85rem' }}>Sin imagen seleccionada</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem',
              background: '#f8fafc',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}
              >
                Cancelar
              </button>

              <button 
                onClick={handleSavePhoto}
                disabled={uploading || !newPhotoUrl}
                className="btn btn-primary"
                style={{
                  padding: '0.6rem 1.4rem',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: (uploading || !newPhotoUrl) ? 0.6 : 1
                }}
              >
                <Save size={16} /> Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

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
