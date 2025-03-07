# Pruebas del Sistema de Gestión de Vacaciones

## Descripción
Este directorio contiene las pruebas unitarias y de integración para el Sistema de Gestión de Vacaciones.

## Estructura de Pruebas
- `models/`: Pruebas para modelos de datos
- `controllers/`: Pruebas para controladores
- `integration/`: Pruebas de integración

## Ejecutar Pruebas

### Todas las pruebas
```bash
npm test
```

### Pruebas de modelos
```bash
npm run test:models
```

### Pruebas de controladores
```bash
npm run test:controllers
```

### Cobertura de código
```bash
npm run test:coverage
```

## Herramientas
- Jest: Framework de pruebas
- Supertest: Pruebas de API
- MongoDB Memory Server: Base de datos en memoria para pruebas

## Configuración
- `jest.config.js`: Configuración global de Jest
- `global-setup.js`: Configuración inicial de pruebas
- `global-teardown.js`: Limpieza después de pruebas

## Mejores Prácticas
- Cada prueba debe ser independiente
- Usar datos de prueba realistas
- Cubrir casos de éxito y error
- Mantener las pruebas pequeñas y enfocadas

## Contribución
Por favor, añade pruebas para cualquier nueva funcionalidad o corrección de errores. 