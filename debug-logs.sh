#!/bin/bash

# Script para controlar logs de debugging en producción
# Uso: ./debug-logs.sh [enable|disable|status]

case "$1" in
  enable)
    echo "🔧 Habilitando logs de debugging en producción..."
    if command -v vercel &> /dev/null; then
      vercel env add ENABLE_PROD_DEBUG true production
      echo "✅ Variable ENABLE_PROD_DEBUG=true añadida en Vercel"
      echo "🚀 Vercel redesplegará automáticamente tu aplicación"
    else
      echo "⚠️ Vercel CLI no encontrado. Añade manualmente la variable:"
      echo "   ENABLE_PROD_DEBUG=true"
      echo "   en Vercel Dashboard > Settings > Environment Variables"
    fi
    ;;
  disable)
    echo "🔧 Deshabilitando logs de debugging en producción..."
    if command -v vercel &> /dev/null; then
      vercel env rm ENABLE_PROD_DEBUG production
      echo "✅ Variable ENABLE_PROD_DEBUG removida de Vercel"
      echo "🚀 Vercel redesplegará automáticamente tu aplicación"
    else
      echo "⚠️ Vercel CLI no encontrado. Remueve manualmente la variable:"
      echo "   ENABLE_PROD_DEBUG"
      echo "   en Vercel Dashboard > Settings > Environment Variables"
    fi
    ;;
  status)
    echo "📊 Estado actual de debugging:"
    if command -v vercel &> /dev/null; then
      echo "🔍 Verificando variables en Vercel..."
      vercel env list
    else
      echo "⚠️ Vercel CLI no encontrado. Verifica manualmente en:"
      echo "   Vercel Dashboard > Settings > Environment Variables"
    fi
    ;;
  *)
    echo "🚀 Control de Logs de Debugging - AlmaBonita AR"
    echo ""
    echo "Uso: $0 [enable|disable|status]"
    echo ""
    echo "Comandos:"
    echo "  enable   - Habilita logs detallados en producción"
    echo "  disable  - Deshabilita logs detallados en producción"
    echo "  status   - Muestra el estado actual de las variables"
    echo ""
    echo "📝 Nota: Los logs de errors y uploads siempre están activos"
    echo "         Esta opción controla logs adicionales de debugging"
    ;;
esac