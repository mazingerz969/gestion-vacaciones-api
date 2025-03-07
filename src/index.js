const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const { logger, loggerMiddleware } = require('./config/logger');

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const departamentoRoutes = require('./routes/departamentoRoutes');
const solicitudVacacionesRoutes = require('./routes/solicitudVacacionesRoutes');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear aplicación Express
const app = express();

// Middleware de logging
app.use(loggerMiddleware);

// Middleware de seguridad
app.use(helmet());

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
}));

// Límite de solicitudes
const limiter = rateLimit({
  windowMs: parseInt(process.env.REQUEST_WINDOW_MS),
  max: parseInt(process.env.MAX_REQUEST_LIMIT)
});
app.use(limiter);

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/departamentos', departamentoRoutes);
app.use('/api/solicitudes-vacaciones', solicitudVacacionesRoutes);

// Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido al Sistema de Gestión de Vacaciones',
    version: '1.0.0'
  });
});

// Middleware de manejo de errores (debe ir después de todas las rutas)
app.use(errorHandler);

// Puerto de escucha
const PORT = process.env.PORT || 5000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  logger.info(`Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`);
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Error no controlado: ${err.message}`);
  // Cerrar servidor y salir
  server.close(() => process.exit(1));
});

module.exports = app;
