const fs = require('fs');
const path = require('path');
const { logger } = require('../src/config/logger');

// Directorio de logs
const logDir = path.join(__dirname, '../logs');

// Función para limpiar logs antiguos
function limpiarLogs(diasAntiguedad = 7) {
  try {
    // Obtener archivos de log
    const archivos = fs.readdirSync(logDir);

    archivos.forEach(archivo => {
      const rutaArchivo = path.join(logDir, archivo);
      const estadisticas = fs.statSync(rutaArchivo);
      
      // Calcular días desde la última modificación
      const diasDesdeModificacion = (Date.now() - estadisticas.mtime) / (1000 * 60 * 60 * 24);

      // Eliminar archivos más antiguos que el límite
      if (diasDesdeModificacion > diasAntiguedad) {
        fs.unlinkSync(rutaArchivo);
        logger.info(`Log eliminado: ${archivo}`);
      }
    });

    logger.info('Limpieza de logs completada');
  } catch (error) {
    logger.error(`Error al limpiar logs: ${error.message}`);
  }
}

// Ejecutar limpieza de logs
limpiarLogs(); 