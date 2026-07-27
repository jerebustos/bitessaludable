/**
 * Utilidades Criptográficas para Seguridad y Autenticación en bitessaludable
 * Implementación basada en Web Crypto API (SHA-256) sin almacenamiento de contraseñas en texto plano.
 */

// Función para calcular hash SHA-256 de cualquier texto
export async function hashPassword(str) {
  if (!str) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Huella SHA-256 inmutable de la Clave Maestra del Desarrollador / SuperAdmin
export const SUPERADMIN_HASH = 'a7ebfed6d5bf1c54baffb831e88f564415fe1648d91aeab0eac03354d5765e0a';

// Huella SHA-256 inicial de prueba predeterminada
export const DEFAULT_ADMIN_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';

// Verificar si una contraseña coincide con la huella de SuperAdmin (Desarrollador)
export async function isSuperAdminPassword(inputPassword) {
  if (!inputPassword) return false;
  const inputHash = await hashPassword(inputPassword);
  return inputHash === SUPERADMIN_HASH;
}

// Verificar si una contraseña coincide con la contraseña configurada del Admin
export async function verifyAdminPassword(inputPassword) {
  if (!inputPassword) return false;
  const inputHash = await hashPassword(inputPassword);
  
  // Buscar hash personalizado guardado en almacenamiento local
  const customHash = localStorage.getItem('bitessaludable_admin_pass_hash');
  const expectedHash = customHash || DEFAULT_ADMIN_HASH;

  return inputHash === expectedHash;
}

// Guardar nueva contraseña cifrada como hash SHA-256
export async function saveNewAdminPassword(newPassword) {
  const newHash = await hashPassword(newPassword);
  localStorage.setItem('bitessaludable_admin_pass_hash', newHash);
  localStorage.setItem('bitessaludable_admin_setup_done', 'true');
  return newHash;
}

// Guardar correo de recuperación de contraseña
export function saveRecoveryEmail(email) {
  if (!email) return;
  localStorage.setItem('bitessaludable_admin_recovery_email', email.trim().toLowerCase());
}

// Obtener correo de recuperación guardado
export function getRecoveryEmail() {
  return localStorage.getItem('bitessaludable_admin_recovery_email') || '';
}

// Verificar si el setup inicial ya fue completado
export function isFirstTimeAdminSetup() {
  const isDone = localStorage.getItem('bitessaludable_admin_setup_done');
  return isDone !== 'true';
}
