#!/bin/bash

# Script de inicialización rápida
# Uso: ./init.sh

set -e  # Exit on error

echo "📖 Inicializando Creador de Artículos Reformados..."
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "Descargalo en: https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js $(node --version) detectado"

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado"
    exit 1
fi

echo "✓ npm $(npm --version) detectado"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

echo ""
echo "⚙️  Configurando variables de entorno..."

# Crear .env si no existe
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Archivo .env creado"
    echo ""
    echo "⚠️  IMPORTANTE: Edita .env.local y agrega tu OPENAI_API_KEY"
    echo "   Abre: .env"
    echo ""
else
    echo "✓ Archivo .env ya existe"
fi

echo ""
echo "🎉 ¡Inicialización completada!"
echo ""
echo "Próximos pasos:"
echo "  1. Edita .env con tu API key"
echo "  2. Ejecuta: npm start"
echo "  3. Abre: http://localhost:3000"
echo ""
echo "✝️  Soli Deo Gloria"
