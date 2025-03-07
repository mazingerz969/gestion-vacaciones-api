const winston = require('winston');
const path = require('path');

// Definir niveles de logging personalizados
const niveles = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Definir colores para los niveles de logging
const colores = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

// Configurar colores
winston.addColors(colores);

// Crear transportes para diferentes entornos
const transportes = {
  consola: new winston.transports.Console({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(
        (info) => `${info.level}: ${info.message}`
      )
    )
  }),
  
  archivoError: new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  archivoGeneral: new winston.transports.File({
    filename: path.join(__dirname, '../../logs/combined.log'),
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
};

// Crear logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels: niveles,
  transports: [
    transportes.consola,
    transportes.archivoError,
    transportes.archivoGeneral
  ],
  exceptionHandlers: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/exceptions.log') 
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/rejections.log') 
    })
  ]
});

// Middleware de logging para Express
const loggerMiddleware = (req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
};

module.exports = {
  logger,
  loggerMiddleware
}; 