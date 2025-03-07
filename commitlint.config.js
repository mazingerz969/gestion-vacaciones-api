module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // Nueva característica
      'fix',      // Corrección de errores
      'docs',     // Cambios en documentación
      'style',    // Formateo de código
      'refactor', // Mejora de código sin cambiar funcionalidad
      'test',     // Añadir o modificar pruebas
      'chore'     // Tareas de mantenimiento
    ]],
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 72]
  }
}; 