const ErrorResponse = require('../utils/errorResponse');
const { logger } = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log de error
  logger.error(`Error: ${error.message}`);

  // Manejar errores específicos de Mongoose
  if (err.name === 'CastError') {
    const message = `Recurso no encontrado con ID ${err.value}`;
    error = new ErrorResponse(message, 404);
    logger.warn(`Cast Error: ${message}`);
  }

  // Manejar error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
    logger.warn(`Validation Error: ${message}`);
  }

  // Manejar error de clave duplicada
  if (err.code === 11000) {
    const message = 'Entrada duplicada';
    error = new ErrorResponse(message, 400);
    logger.warn(`Duplicate Key Error: ${message}`);
  }

  // Respuesta de error
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Error del servidor'
  });
};

module.exports = errorHandler; 