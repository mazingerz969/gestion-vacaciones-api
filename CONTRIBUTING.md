# Guía de Contribución

## Bienvenido/a al Proyecto de Gestión de Vacaciones

Nos alegra que estés interesado/a en contribuir a nuestro proyecto. Cada contribución es valiosa y ayuda a mejorar el sistema.

## 🤝 Cómo Contribuir

### 1. Reportar Problemas

- Utiliza la pestaña de Issues en GitHub
- Describe claramente el problema
- Incluye pasos para reproducir
- Menciona la versión de Node.js, sistema operativo y cualquier detalle relevante

### 2. Sugerir Mejoras

- Abre un Issue detallando tu sugerencia
- Explica el beneficio de la mejora
- Si es posible, incluye un ejemplo de implementación

### 3. Contribuir con Código

#### Proceso de Pull Request

1. Haz un fork del repositorio
2. Crea una rama para tu característica
   ```bash
   git checkout -b feature/nombre-caracteristica
   ```
3. Realiza tus cambios
4. Asegúrate de que las pruebas pasen
   ```bash
   npm test
   npm run lint
   ```
5. Haz commit de tus cambios
   ```bash
   git commit -m "Descripción clara de los cambios"
   ```
6. Sube tus cambios
   ```bash
   git push origin feature/nombre-caracteristica
   ```
7. Abre un Pull Request

### 4. Estándares de Código

#### Estilo de Código
- Sigue el estándar JavaScript (StandardJS)
- Usa ESLint para validación
- Mantén una indentación consistente
- Escribe comentarios claros y concisos

#### Pruebas
- Escribe pruebas para nuevas funcionalidades
- Mantén o aumenta la cobertura de código
- Prueba casos de éxito y error

### 5. Revisión de Código

- Un revisor evaluará tu Pull Request
- Puede solicitar cambios o mejoras
- Sé receptivo a los comentarios

## 🛠 Configuración de Desarrollo

1. Clona el repositorio
2. Instala dependencias
   ```bash
   npm install
   ```
3. Configura variables de entorno
   ```bash
   cp .env.example .env
   ```
4. Ejecuta el proyecto en modo desarrollo
   ```bash
   npm run dev
   ```

## 📋 Guía de Estilo de Commits

- Usa commits semánticos
- Formato: `<tipo>: <descripción>`
- Tipos:
  - `feat`: Nueva característica
  - `fix`: Corrección de errores
  - `docs`: Cambios en documentación
  - `style`: Formateo de código
  - `refactor`: Mejora de código
  - `test`: Añadir o modificar pruebas
  - `chore`: Tareas de mantenimiento

## 🔒 Código de Conducta

- Sé respetuoso/a
- Colabora de manera constructiva
- Mantén un ambiente inclusivo

## 📞 Contacto

- **Email**: contribuciones@empresa.com
- **Issues**: [Enlace a Issues de GitHub]

¡Gracias por contribuir! 