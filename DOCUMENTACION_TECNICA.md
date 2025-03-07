# Documentación Técnica - Sistema de Gestión de Vacaciones

## 1. Arquitectura del Sistema

### 1.1 Visión General
- **Tipo de Aplicación**: API RESTful para gestión de vacaciones
- **Lenguaje**: Node.js
- **Framework**: Express.js
- **Base de Datos**: MongoDB

### 1.2 Componentes Principales
- **Backend API**: Node.js/Express
- **Base de Datos**: MongoDB
- **Autenticación**: JWT (JSON Web Tokens)
- **Logging**: Winston
- **Seguridad**: Helmet, CORS, Rate Limiting

## 2. Estructura del Proyecto

```
gestion-vacaciones-api/
│
├── src/
│   ├── config/         # Configuraciones de la aplicación
│   ├── controllers/    # Lógica de controladores
│   ├── models/         # Modelos de datos de Mongoose
│   ├── routes/         # Definiciones de rutas
│   ├── middleware/     # Middlewares personalizados
│   └── utils/          # Utilidades y helpers
│
├── tests/              # Pruebas unitarias e integración
├── logs/               # Archivos de registro
├── scripts/            # Scripts utilitarios
└── docs/               # Documentación
```

## 3. Modelos de Datos

### 3.1 Usuario
- **Campos**:
  - `nombre`: Nombre del usuario
  - `apellido`: Apellido del usuario
  - `email`: Correo electrónico (único)
  - `password`: Contraseña hasheada
  - `rol`: Rol del usuario (empleado, gerente, rrhh, admin)
  - `departamento`: Referencia al departamento
  - `diasVacacionesDisponibles`: Días de vacaciones restantes

### 3.2 Departamento
- **Campos**:
  - `nombre`: Nombre del departamento
  - `descripcion`: Descripción del departamento
  - `responsable`: Usuario responsable del departamento
  - `ubicacion`: Ubicación del departamento

### 3.3 Solicitud de Vacaciones
- **Campos**:
  - `usuario`: Usuario que solicita vacaciones
  - `fechaInicio`: Fecha de inicio de vacaciones
  - `fechaFin`: Fecha de fin de vacaciones
  - `diasSolicitados`: Número de días solicitados
  - `estado`: Estado de la solicitud (pendiente, aprobada, rechazada)
  - `motivoRechazo`: Motivo en caso de rechazo
  - `aprobadoPor`: Usuario que aprobó/rechazó la solicitud

## 4. Autenticación y Autorización

### 4.1 Flujo de Autenticación
1. Registro de usuario
2. Inicio de sesión
3. Generación de token JWT
4. Autorización basada en roles

### 4.2 Roles
- **Empleado**: Solicitar vacaciones
- **Gerente**: Aprobar/rechazar solicitudes de su departamento
- **RRHH**: Gestionar todos los aspectos de vacaciones
- **Admin**: Configuración y gestión del sistema

## 5. Seguridad

### 5.1 Medidas de Seguridad
- Hasheo de contraseñas con bcrypt
- Tokens JWT con expiración
- Protección contra ataques CSRF
- Rate limiting
- Validación de entrada
- CORS configurado
- Helmet para configuraciones de seguridad HTTP

## 6. Logging

### 6.1 Configuración de Logging
- Niveles: error, warn, info, http, debug
- Archivos de log separados
- Rotación y limpieza de logs
- Registro de eventos en consola y archivos

## 7. Pruebas

### 7.1 Estrategia de Pruebas
- Pruebas unitarias para modelos
- Pruebas de integración para controladores
- Cobertura de código mínima del 50%
- Uso de MongoDB Memory Server

## 8. Despliegue

### 8.1 Requisitos
- Node.js v16+
- MongoDB v4.4+
- Variables de entorno configuradas

### 8.2 Pasos de Despliegue
1. Clonar repositorio
2. Instalar dependencias
3. Configurar variables de entorno
4. Iniciar base de datos
5. Ejecutar migraciones (si aplica)
6. Iniciar servidor

## 9. Configuración de Entorno

### 9.1 Variables de Entorno Críticas
- `MONGODB_URI`: Conexión a base de datos
- `JWT_SECRET`: Clave secreta para tokens
- `PORT`: Puerto del servidor
- `NODE_ENV`: Entorno de ejecución

## 10. Mantenimiento

### 10.1 Tareas Periódicas
- Actualización de dependencias
- Limpieza de logs
- Respaldos de base de datos
- Revisión de configuraciones de seguridad

## 11. Mejoras Futuras
- Integración con sistemas de calendario
- Notificaciones por correo
- Panel de administración
- Reportes y analytics

## 12. Contacto y Soporte
- **Email**: soporte@empresa.com
- **Repositorio**: https://github.com/mazingerz969/gestion-vacaciones-api

---

**Última actualización**: $(date +'%d/%m/%Y')
**Versión**: 1.0.0 