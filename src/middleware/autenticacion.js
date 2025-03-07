const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const Usuario = require('../models/Usuario');

// Proteger rutas
exports.protegerRuta = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si existe el token en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si no hay token
  if (!token) {
    return next(new ErrorResponse('No autorizado para acceder a esta ruta', 401));
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return next(new ErrorResponse('No se encontró el usuario', 404));
    }

    // Añadir usuario a la solicitud
    req.usuario = usuario;
    next();
  } catch (error) {
    return next(new ErrorResponse('No autorizado', 401));
  }
});

// Autorizar roles
exports.autorizarRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return next(
        new ErrorResponse(
          `El rol ${req.usuario.rol} no está autorizado para acceder a esta ruta`, 
          403
        )
      );
    }
    next();
  };
}; 