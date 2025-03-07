# Sistema de Gestión de Vacaciones

## 📋 Descripción del Proyecto

Este sistema permite a las organizaciones gestionar de manera eficiente las solicitudes de vacaciones de sus empleados. Ofrece funcionalidades para empleados, gerentes y departamento de Recursos Humanos.

## ✨ Características Principales

- 👤 Registro y autenticación de usuarios
- 📅 Solicitud de vacaciones
- 🔍 Aprobación/Rechazo de solicitudes
- 📊 Gestión de días disponibles
- 🔒 Control de acceso basado en roles

## 🚀 Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: JWT
- **Testing**: Jest, Supertest
- **Logging**: Winston
- **Seguridad**: Helmet, bcrypt

## 📦 Requisitos Previos

- Node.js v16+
- MongoDB v4.4+
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/mazingerz969/gestion-vacaciones-api.git
cd gestion-vacaciones-api
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

## 🧪 Pruebas

- Ejecutar pruebas: `npm test`
- Cobertura de código: `npm run test:coverage`

## 🌐 Endpoints Principales

- `POST /api/usuarios/registro`: Registro de usuario
- `POST /api/usuarios/login`: Inicio de sesión
- `GET /api/usuarios/perfil`: Obtener perfil
- `POST /api/vacaciones/solicitar`: Solicitar vacaciones
- `GET /api/vacaciones/consultar`: Consultar solicitudes

## 📝 Documentación

Consulta la [Documentación Técnica](DOCUMENTACION_TECNICA.md) para más detalles.

## 🤝 Contribución

1. Haz un fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/nueva-caracteristica`)
3. Confirma tus cambios (`git commit -m 'Añadir nueva característica'`)
4. Sube tu rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📞 Contacto

- **Email**: soporte@empresa.com
- **Repositorio**: https://github.com/mazingerz969/gestion-vacaciones-api

---

**Versión**: 1.0.0
