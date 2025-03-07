#!/bin/bash

# Script de configuración para el Sistema de Gestión de Vacaciones

# Salir si hay algún error
set -e

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "Node.js no está instalado. Por favor, instálelo primero."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node --version)
REQUIRED_VERSION="v16.0.0"
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "Se requiere Node.js $REQUIRED_VERSION o superior. Versión actual: $NODE_VERSION"
    exit 1
fi

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Copiar archivo de entorno de ejemplo
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Archivo .env creado. Por favor, configúrelo con sus valores específicos."
fi

# Configurar Git hooks (opcional)
if [ -d .git/hooks ]; then
    echo "#!/bin/sh" > .git/hooks/pre-commit
    echo "npm run lint" >> .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
fi

# Mensaje de éxito
echo "Configuración completada exitosamente."
echo "Puede iniciar el servidor con 'npm run dev'" 