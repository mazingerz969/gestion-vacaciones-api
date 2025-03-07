# Manual de Implementación - Sistema de Gestión de Vacaciones

## Índice
1. [Introducción](#introducción)
2. [Requisitos del Sistema](#requisitos-del-sistema)
3. [Arquitectura](#arquitectura)
4. [Instalación](#instalación)
   - [Backend](#backend)
   - [Frontend Web](#frontend-web)
   - [Aplicación Móvil](#aplicación-móvil)
5. [Configuración](#configuración)
   - [Variables de Entorno](#variables-de-entorno)
   - [Integración con Sistemas Existentes](#integración-con-sistemas-existentes)
6. [Base de Datos](#base-de-datos)
7. [Seguridad](#seguridad)
8. [Despliegue](#despliegue)
9. [Pruebas](#pruebas)
10. [Mantenimiento](#mantenimiento)

## Introducción

Este documento detalla los pasos necesarios para implementar el Sistema de Gestión de Vacaciones. La aplicación permite a los empleados solicitar vacaciones, a los gerentes aprobar o rechazar solicitudes, y al departamento de RRHH gestionar los días disponibles para cada empleado.

## Requisitos del Sistema

### Backend
- Node.js v16 o superior
- MongoDB v4.4 o superior
- Servidor con al menos 2GB RAM
- Almacenamiento mínimo: 10GB

### Frontend Web
- Node.js v16 o superior para compilación
- Servidor web (Nginx/Apache)

### Aplicación Móvil
- React Native CLI
- Android SDK para compilación Android
- XCode para compilación iOS
- JDK 11

## Arquitectura

El sistema está compuesto por tres componentes principales:

1. **Backend API (Node.js/Express)**: Proporciona los endpoints REST para todas las operaciones.
2. **Frontend Web (React)**: Interfaz web para acceso desde navegadores.
3. **Aplicación Móvil (React Native)**: Versión móvil para iOS y Android.

La comunicación entre componentes se realiza mediante API REST sobre HTTPS. La autenticación utiliza tokens JWT y puede integrarse con sistemas de identidad existentes.

## Instalación

### Backend

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/empresa/gestion-vacaciones-api.git
   cd gestion-vacaciones-api
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configurar las variables de entorno (ver sección de [Configuración](#configuración)).

5. Iniciar en modo desarrollo:
   ```bash
   npm run dev
   ```

6. Compilar para producción:
   ```bash
   npm run build
   ```

### Frontend Web

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/empresa/gestion-vacaciones-web.git
   cd gestion-vacaciones-web
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Crear archivo de variables de entorno:
   ```bash
   cp .env.example .env
   ```

4. Configurar la URL de la API y otras variables.

5. Iniciar en modo desarrollo:
   ```bash
   npm start
   ```

6. Compilar para producción:
   ```bash
   npm run build
   ```

7. El resultado se generará en la carpeta `build`, que debe desplegarse en el servidor web.

### Aplicación Móvil

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/empresa/gestion-vacaciones-mobile.git
   cd gestion-vacaciones-mobile
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Instalar pods para iOS:
   ```bash
   cd ios && pod install && cd ..
   ```

4. Configurar archivo de variables:
   ```bash
   cp .env.example .env
   ```

5. Ejecutar en modo desarrollo:
   - Android: `npm run android`
   - iOS: `npm run ios`

6. Generar APK/AAB para Android:
   ```bash
   cd android
   ./gradlew assembleRelease   # Para APK
   ./gradlew bundleRelease     # Para AAB (Google Play)
   ```

7. Generar IPA para iOS:
   - Abrir el proyecto en XCode
   - Configurar los certificados y perfiles de aprovisionamiento
   - Archivar y exportar la aplicación

## Configuración

### Variables de Entorno

#### Backend API
```
# Servidor
PORT=5000
NODE_ENV=production

# Base de datos
MONGODB_URI=mongodb://usuario:contraseña@host:puerto/vacaciones?authSource=admin

# JWT
JWT_SECRET=miclaveultrasecreta
JWT_EXPIRES_IN=7d

# Integración
HR_SYSTEM_API=https://rrhh.empresa.com/api
AUTH_SYSTEM_API=https://auth.empresa.com/api
INTEGRATION_API_KEY=clave_api_integración
SYNC_INTERVAL_MINUTES=60

# Correo
MAIL_HOST=smtp.empresa.com
MAIL_PORT=587
MAIL_USER=notificaciones@empresa.com
MAIL_PASS=contraseña
MAIL_FROM=Gestión de Vacaciones <notificaciones@empresa.com>
```

#### Frontend Web
```
REACT_APP_API_URL=https://api-vacaciones.empresa.com
REACT_APP_VERSION=1.0.0
```

#### Aplicación Móvil
```
API_URL=https://api-vacaciones.empresa.com
APP_VERSION=1.0.0
```

### Integración con Sistemas Existentes

El sistema permite la integración con aplicaciones empresariales existentes:

1. **Sistema de RRHH**: Proporciona información sobre empleados, departamentos y asignación de días de vacaciones.
2. **Sistema de Autenticación**: Gestiona la autenticación de usuarios.
3. **Calendario Corporativo**: Para fechas festivas y planificación.

Para cada integración, es necesario:

1. Asegurarse de que las APIs externas estén disponibles
2. Configurar las URL y claves de API en las variables de entorno
3. Verificar el formato de los datos intercambiados
4. Programar la sincronización periódica (por defecto cada 60 minutos)

## Base de Datos

El sistema utiliza MongoDB como base de datos. Para la instalación inicial:

1. Crear la base de datos:
   ```
   use vacaciones
   ```

2. Crear usuario con permisos:
   ```
   db.createUser({
     user: "usuario_app",
     pwd: "contraseña_segura",
     roles: [{ role: "readWrite", db: "vacaciones" }]
   })
   ```

3. Las colecciones se crearán automáticamente al iniciar la aplicación.

### Carga Inicial de Datos

Para la carga inicial de datos, puede usar el script proporcionado:

```bash
npm run seed
```

Este comando cargará:
- Departamentos básicos
- Usuario administrador inicial
- Calendario laboral del año actual

## Seguridad

### Configuración HTTPS

Es fundamental configurar HTTPS para todas las comunicaciones:

1. **Backend API**:
   - Obtener certificado SSL (Let's Encrypt o proveedor comercial)
   - Configurar en Nginx/Apache o directamente en Express

2. **Frontend Web**:
   - Asegurarse de que el servidor web tenga HTTPS configurado

3. **Aplicación Móvil**:
   - Configurar Network Security Config en Android
   - Asegurarse de que las comunicaciones usen HTTPS

### Protección de Datos

1. Nunca almacenar contraseñas en texto plano
2. Utilizar variables de entorno para secretos
3. Implementar validación de entrada en todas las API
4. Utilizar middleware de seguridad (helmet, cors, etc.)
5. Configurar políticas de respaldo regulares para la base de datos

## Despliegue

### Producción

Recomendamos las siguientes opciones para el despliegue en producción:

#### Backend API
- **Opción 1**: Contenedores Docker + Kubernetes
- **Opción 2**: Servidor dedicado con PM2
- **Opción 3**: Servicios gestionados (AWS Elastic Beanstalk, Google App Engine)

#### Frontend Web
- **Opción 1**: CDN + S3/Almacenamiento Blob
- **Opción 2**: Servidor Nginx/Apache
- **Opción 3**: Netlify, Vercel o similar

#### Aplicación Móvil
- Android: Google Play Store
- iOS: Apple App Store

### Entornos Múltiples

Se recomienda configurar al menos tres entornos:
- **Desarrollo**: Para trabajo diario de los desarrolladores
- **Pruebas/QA**: Para testeo antes de producción
- **Producción**: Sistema en vivo

## Pruebas

Antes del despliegue final, realice las siguientes pruebas:

1. **Pruebas Unitarias**:
   ```bash
   npm run test
   ```

2. **Pruebas de Integración**:
   ```bash
   npm run test:integration
   ```

3. **Pruebas de Estrés**:
   ```bash
   npm run test:stress
   ```

## Mantenimiento

### Actualizaciones

Para actualizar el sistema:

1. Clonar la última versión del repositorio
2. Realizar copias de seguridad de la base de datos
3. Seguir las instrucciones específicas de la versión en el CHANGELOG
4. Aplicar actualizaciones en horarios de baja actividad

### Monitoreo

Recomendamos implementar:
- Logging centralizado (ELK Stack, Graylog)
- Monitoreo de aplicaciones (New Relic, Datadog)
- Alertas para eventos críticos

### Soporte

El equipo de soporte debe tener acceso a:
- Logs del sistema
- Panel de administración
- Documentación técnica y de usuario
- Sistema de tickets para seguimiento de incidencias

---

## Contacto

Para más información o soporte durante la implementación, contacte a:
- Email: soporte@empresa.com
- Teléfono: +34 91 123 45 67
