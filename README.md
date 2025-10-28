# 🌟 AlmaBonita - AR Experience Creator

Una aplicación web moderna para crear experiencias de realidad aumentada personalizadas usando marcadores HIRO. Convierte tus imágenes y mensajes en experiencias AR interactivas que puedes compartir fácilmente.

[![Next.js](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![AR.js](https://img.shields.io/badge/AR.js-Latest-green?style=for-the-badge)](https://ar-js-org.github.io/AR.js/)
[![A-Frame](https://img.shields.io/badge/A--Frame-1.0.4-red?style=for-the-badge)](https://aframe.io/)

## ✨ Características

### 🎨 **Creador Visual Intuitivo**
- **Interfaz Drag & Drop**: Sube imágenes arrastrando y soltando
- **Vista Previa en Tiempo Real**: Ve cómo se verá tu experiencia AR
- **Editor de Texto Avanzado**: Personaliza títulos, subtítulos y colores
- **Posicionamiento Flexible**: Coloca texto arriba o abajo de las imágenes

### 🎭 **Efectos y Animaciones**
- **7 Animaciones Disponibles**: Bounce, Pulse, Rotate, Wave, Fade, Scale
- **Efectos de Partículas**: Corazones, estrellas, confetti
- **Texto 3D**: Crea títulos tridimensionales con profundidad personalizable
- **Colores Dinámicos**: Paleta completa de colores para textos

### 📱 **Optimizado para Móviles**
- **Cámara Full-Screen**: Experiencia AR inmersiva en dispositivos móviles
- **Responsive Design**: Funciona perfectamente en desktop y móvil
- **PWA Ready**: Instalable como aplicación nativa
- **Gestos Touch**: Interacción natural con pellizco y zoom

### 🔗 **Compartir y Distribuir**
- **URLs Personalizadas**: Cada experiencia tiene su enlace único
- **Códigos QR Automáticos**: Comparte fácilmente con códigos QR
- **Marcador HIRO**: Utiliza el estándar más compatible de AR
- **Sin Instalación**: Los usuarios solo necesitan un navegador web

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/santiago2904/Almabonita.front.git
cd Almabonita.front

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales de Cloudinary

# Ejecutar en desarrollo
npm run dev
```

### Configuración de Cloudinary

1. **Crear cuenta gratuita** en [Cloudinary](https://cloudinary.com/users/register_free)
2. **Obtener credenciales** del Dashboard
3. **Configurar variables de entorno**:

```bash
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key  
CLOUDINARY_API_SECRET=tu_api_secret
```

4. **En Vercel**: Agregar las variables en Settings > Environment Variables

La aplicación estará disponible en `http://localhost:3000`

### Build para Producción

```bash
# Crear build optimizado
npm run build

# Ejecutar build de producción
npm start
```

## 📱 Cómo Usar

### 1. **Crear una Experiencia AR**
1. Ve a `/ar-creator`
2. Sube una imagen (JPG, PNG, GIF - máx. 5MB)
3. Personaliza tu texto y colores
4. Selecciona animaciones y efectos
5. Configura la posición del texto
6. Genera tu experiencia AR

### 2. **Compartir tu Creación**
- **URL Directa**: Copia y pega el enlace generado
- **Código QR**: Escanea con cualquier dispositivo móvil
- **Marcador HIRO**: Imprime el marcador para usar offline

### 3. **Visualizar en AR**
1. Abre el enlace en tu dispositivo móvil
2. Permite acceso a la cámara
3. Apunta a un marcador HIRO
4. ¡Disfruta tu experiencia AR personalizada!

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.0.0** - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Styling utility-first
- **Shadcn/ui** - Componentes UI elegantes

### AR & 3D
- **AR.js** - Biblioteca de realidad aumentada
- **A-Frame** - Framework WebXR
- **Three.js** - Motor 3D (incluido con A-Frame)

### Features
- **QR Code Generation** - Códigos QR automáticos
- **File Upload** - Subida de archivos con preview
- **Image Processing** - Análisis de propiedades de imagen
- **Responsive Design** - Adaptable a todos los dispositivos

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── ar-creator/        # Creador de experiencias AR
│   ├── ar-viewer/         # Visualizador AR
│   └── api/upload/        # API para subida de archivos
├── components/            # Componentes reutilizables
│   ├── ar/               # Componentes específicos de AR
│   └── ui/               # Componentes de interfaz
├── hooks/                # Custom React hooks
├── lib/                  # Utilidades y configuración
├── public/               # Archivos estáticos
│   ├── gesture-detector.js
│   ├── gesture-handler.js
│   └── uploads/          # Imágenes subidas
└── types/                # Definiciones de TypeScript
```

## 🎯 Casos de Uso

### 💝 **Regalos Personalizados**
- Tarjetas de cumpleaños interactivas
- Mensajes de aniversario
- Declaraciones de amor únicas

### 🏢 **Marketing y Publicidad**
- Campañas publicitarias inmersivas
- Catálogos de productos AR
- Experiencias de marca memorable

### 🎓 **Educación**
- Material didáctico interactivo
- Presentaciones inmersivas
- Proyectos estudiantiles creativos

### 🎨 **Arte y Creatividad**
- Instalaciones artísticas digitales
- Portafolios interactivos
- Expresión creativa moderna

## 🌐 Demo en Vivo

- **Creador**: [https://almabonita.vercel.app/ar-creator](https://almabonita.vercel.app/ar-creator)
- **Ejemplo AR**: [https://almabonita.vercel.app/ar-viewer?img=demo.jpg&text=Hola%20AR](https://almabonita.vercel.app/ar-viewer)

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar AlmaBonita:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📋 Roadmap

### 🎯 **Próximas Características**
- [ ] **Marcadores Personalizados**: Crea tus propios marcadores
- [ ] **Modelos 3D**: Soporte para objetos tridimensionales
- [ ] **Audio Espacial**: Añade sonidos a tus experiencias
- [ ] **Grabación de Video**: Captura y comparte experiencias AR
- [ ] **Galería Pública**: Explora creaciones de otros usuarios
- [ ] **API REST**: Integración con aplicaciones externas

### 🔧 **Mejoras Técnicas**
- [ ] **WebXR Support**: Soporte para dispositivos de realidad mixta
- [ ] **PWA Completa**: Funcionalidad offline completa
- [ ] **Optimización de Performance**: Carga más rápida
- [ ] **Analytics**: Métricas de uso y engagement

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Santiago Palacio**
- GitHub: [@santiago2904](https://github.com/santiago2904)

## 🙏 Agradecimientos

- **AR.js Team** - Por la increíble biblioteca de AR
- **A-Frame Community** - Por el framework WebXR
- **Next.js Team** - Por el mejor framework de React
- **Shadcn** - Por los componentes UI elegantes

---

<div align="center">
  <p>⭐ Si te gusta este proyecto, ¡no olvides darle una estrella! ⭐</p>
  <p>Hecho con ❤️ para democratizar la realidad aumentada</p>
</div>
