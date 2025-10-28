#!/bin/bash

echo "🧹 Limpiando cache y builds anteriores..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .vercel

echo "📦 Instalando dependencias..."
npm install

echo "🏗️ Creando build de producción..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build exitoso!"
    echo "🚀 Listo para deploy a Vercel"
    echo ""
    echo "Para deployar ejecuta: vercel --prod"
    echo ""
    echo "📋 Checklist antes del deploy:"
    echo "  ☐ Variables de entorno configuradas en Vercel"
    echo "  ☐ CLOUDINARY_CLOUD_NAME"
    echo "  ☐ CLOUDINARY_API_KEY" 
    echo "  ☐ CLOUDINARY_API_SECRET"
else
    echo "❌ Error en el build"
    exit 1
fi