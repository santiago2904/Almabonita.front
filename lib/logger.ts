// Utilidad de logging para debugging en producción
// Mantiene los logs en desarrollo y producción para debugging

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

// Tipos de log con emojis para fácil identificación
export const logger = {
  // Información general
  info: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`ℹ️ [${timestamp}] ${message}`, data || '');
  },

  // Éxito/completado
  success: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`✅ [${timestamp}] ${message}`, data || '');
  },

  // Advertencias
  warn: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.warn(`⚠️ [${timestamp}] ${message}`, data || '');
  },

  // Errores
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    console.error(`❌ [${timestamp}] ${message}`, error || '');
  },

  // Debug (solo en desarrollo, pero puede activarse en prod)
  debug: (message: string, data?: any) => {
    if (isDev || process.env.ENABLE_PROD_DEBUG === 'true') {
      const timestamp = new Date().toISOString();
      console.log(`🐛 [${timestamp}] ${message}`, data || '');
    }
  },

  // API calls
  api: (method: string, url: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`🌐 [${timestamp}] ${method} ${url}`, data || '');
  },

  // Upload progress
  upload: (message: string, progress?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`📤 [${timestamp}] ${message}`, progress || '');
  },

  // Cloudinary specific
  cloudinary: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`☁️ [${timestamp}] Cloudinary: ${message}`, data || '');
  },

  // AR specific
  ar: (message: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`🥽 [${timestamp}] AR: ${message}`, data || '');
  },

  // Performance tracking
  perf: (message: string, startTime?: number) => {
    const timestamp = new Date().toISOString();
    const duration = startTime ? Date.now() - startTime : null;
    console.log(`⚡ [${timestamp}] ${message}`, duration ? `(${duration}ms)` : '');
  }
};

// Utilidad para crear un timer de performance
export const createTimer = () => {
  return Date.now();
};

// Utilidad para logging condicional en producción
export const prodLog = (message: string, data?: any) => {
  if (isProd) {
    console.log(`🚀 [PROD] ${message}`, data || '');
  }
};