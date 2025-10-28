# 🐛 Debugging en Producción - AlmaBonita AR

Esta guía te ayudará a diagnosticar problemas de subida de imágenes y otros issues en producción.

## 📊 Logs Implementados

### 🔍 Logs Activos por Defecto

Los siguientes logs siempre están activos en producción:

#### API Upload (`/api/upload`)
```
🚀 Upload API called at: [timestamp]
🌍 Environment: production
🔧 Cloudinary config check: { hasCloudName, hasApiKey, hasApiSecret }
📝 Parsing form data...
📁 File received: { name, size, type, exists }
🖼️ Validating file type: [type]
📏 Validating file size: [bytes]
🔄 Converting file to base64...
☁️ Uploading to Cloudinary with config: [config]
🎉 Upload successful! Cloudinary response: [response]
📤 Sending response: [final response]
```

#### Cliente (Frontend)
```
📂 File selected in ARCreator: { name, size, type }
🎬 Starting upload process for file: [file info]
📦 Creating FormData...
🌐 Making API request to /api/upload...
📡 API response received: { status, statusText, ok }
✅ Upload response parsed: [response]
🖼️ Final image URL: [url]
```

### ❌ Logs de Error

```
❌ Configuración de Cloudinary incompleta
❌ No file found in form data
❌ Invalid file type: [type]
❌ File too large: [size]
💥 Critical error in upload API: { message, stack, timestamp }
☁️ Cloudinary specific error: { http_code, message, name }
```

## 🛠️ Cómo Diagnosticar Problemas

### 1. **Error "Failed to upload image"**

**Revisar en la consola del navegador:**
```javascript
// Buscar estos logs:
📂 File selected in ARCreator
🎬 Starting upload process
📡 API response received
```

**Si no aparece `📡 API response received`:**
- Problema de conectividad
- API route no accesible
- Error en la petición

**Si aparece con `ok: false`:**
- Ver el `status` y `statusText`
- Revisar logs del servidor en Vercel

### 2. **Error de Configuración de Cloudinary**

**Buscar en logs:**
```
🔧 Cloudinary config check: { 
  hasCloudName: false,  // ❌ Problema aquí
  hasApiKey: true, 
  hasApiSecret: true 
}
```

**Solución:**
1. Verificar variables en Vercel Dashboard
2. Asegurar que los nombres coincidan exactamente:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 3. **Archivo No Válido**

**Logs esperados:**
```
❌ Invalid file type: application/pdf
❌ File too large: 15728640
```

**Validaciones:**
- Solo archivos `image/*`
- Máximo 10MB
- Formatos: JPG, PNG, GIF, WebP

### 4. **Error de Cloudinary**

**Logs específicos:**
```
☁️ Cloudinary specific error: {
  http_code: 401,
  message: "Invalid credentials",
  name: "Error"
}
```

**Códigos comunes:**
- `401`: Credenciales inválidas
- `403`: Límites de cuenta excedidos
- `420`: Rate limit exceeded
- `500`: Error interno de Cloudinary

## 🔧 Herramientas de Debugging

### Script de Control

```bash
# Habilitar debugging extendido
./debug-logs.sh enable

# Deshabilitar debugging extendido  
./debug-logs.sh disable

# Ver estado actual
./debug-logs.sh status
```

### Variables de Entorno

```bash
# En Vercel Dashboard > Settings > Environment Variables
ENABLE_PROD_DEBUG=true  # Habilita logs extra
```

## 📱 Debugging en Dispositivos Móviles

### Chrome DevTools Remoto
1. Conectar dispositivo Android
2. `chrome://inspect` en desktop
3. Inspeccionar página AR

### Safari Web Inspector (iOS)
1. Habilitar "Desarrollo" en Safari iOS
2. Conectar a Mac con Safari
3. Develop > [Device] > [Page]

### Debugging en Device
```javascript
// Logs visibles en pantalla (solo para testing)
document.body.insertAdjacentHTML('beforeend', 
  `<div style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.8);color:white;padding:10px;font-size:12px;z-index:9999;">
    Upload Status: ${status}
  </div>`
);
```

## 🚨 Problemas Comunes y Soluciones

### Error: "No file provided"
```javascript
// Verificar que el FormData tenga el campo correcto
formData.append('image', file); // ✅ Correcto
formData.append('file', file);  // ❌ Incorrecto
```

### Error: "Invalid credentials" 
1. Verificar credenciales en Cloudinary Dashboard
2. Copiar exactamente (sin espacios extra)
3. Verificar que estén en Environment Variables de Vercel
4. Redesplegar si es necesario

### Error: "Resource not found"
- URL de imagen incorrecta
- Imagen eliminada de Cloudinary
- Problema de CDN/cache

### Timeout/Network Error
- Archivo demasiado grande
- Conexión lenta
- Límites de Vercel (10MB max)

## 📊 Monitoreo Continuo

### Métricas a Observar
- Tiempo de subida promedio
- Tasa de errores de upload
- Tipos de archivos más comunes
- Tamaños de archivos promedio

### Alertas Recomendadas
```javascript
// Error rate > 10%
if (errorCount / totalUploads > 0.1) {
  console.error('🚨 High error rate detected');
}

// Upload time > 30s
if (uploadTime > 30000) {
  console.warn('⚠️ Slow upload detected');
}
```

## 🔄 Proceso de Resolución

1. **Identificar** el problema con logs
2. **Reproducir** localmente si es posible
3. **Verificar** configuración (variables de entorno)
4. **Probar** con diferentes archivos/dispositivos
5. **Escalar** a Cloudinary support si es necesario

## 📞 Contacto y Soporte

- **Cloudinary Support**: [cloudinary.com/support](https://cloudinary.com/support)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Issues del Proyecto**: [GitHub Issues](https://github.com/santiago2904/Almabonita.front/issues)