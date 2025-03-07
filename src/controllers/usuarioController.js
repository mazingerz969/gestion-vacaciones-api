const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// @desc    Registrar nuevo usuario
// @route   POST /api/usuarios/registro
// @access  Public
exports.registrarUsuario = asyncHandler(async (req, res, next) => {
  const { nombre, apellido, email, password, rol } = req.body;

  // Verificar si el usuario ya existe
  const usuarioExistente = await Usuario.findOne({ email });
  if (usuarioExistente) {
    return next(new ErrorResponse('El usuario ya existe', 400));
  }

  // Crear nuevo usuario
  const usuario = await Usuario.create({
    nombre,
    apellido,
    email,
    password,
    rol
  });

  // Generar token
  const token = generarToken(usuario);

  // Enviar respuesta
  res.status(201).json({
    success: true,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombreCompleto,
      email: usuario.email,
      rol: usuario.rol
    }
  });
});

// @desc    Iniciar sesión
// @route   POST /api/usuarios/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validar que se proporcionen email y contraseña
  if (!email || !password) {
    return next(new ErrorResponse('Por favor proporcione email y contraseña', 400));
  }

  // Buscar usuario y seleccionar contraseña
  const usuario = await Usuario.findOne({ email }).select('+password');

  // Verificar si el usuario existe
  if (!usuario) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // Verificar contraseña
  const esPasswordCorrecto = await usuario.compararPassword(password);
  if (!esPasswordCorrecto) {
    return next(new ErrorResponse('Credenciales inválidas', 401));
  }

  // Generar token
  const token = generarToken(usuario);

  // Enviar respuesta
  res.status(200).json({
    success: true,
    token,
    usuario: {
      id: usuario._id,
      nombre: usuario.nombreCompleto,
      email: usuario.email,
      rol: usuario.rol
    }
  });
});

// @desc    Obtener perfil de usuario
// @route   GET /api/usuarios/perfil
// @access  Private
exports.obtenerPerfil = asyncHandler(async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario.id)
    .populate('departamento', 'nombre');

  res.status(200).json({
    success: true,
    usuario
  });
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/usuarios/perfil
// @access  Private
exports.actualizarPerfil = asyncHandler(async (req, res, next) => {
  const camposActualizables = {
    nombre: req.body.nombre,
    apellido: req.body.apellido
  };

  const usuario = await Usuario.findByIdAndUpdate(
    req.usuario.id, 
    camposActualizables, 
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    usuario
  });
});

// @desc    Cambiar contraseña
// @route   PUT /api/usuarios/cambiar-password
// @access  Private
exports.cambiarPassword = asyncHandler(async (req, res, next) => {
  const { passwordActual, nuevaPassword } = req.body;

  // Buscar usuario y seleccionar contraseña
  const usuario = await Usuario.findById(req.usuario.id).select('+password');

  // Verificar contraseña actual
  const esPasswordCorrecto = await usuario.compararPassword(passwordActual);
  if (!esPasswordCorrecto) {
    return next(new ErrorResponse('La contraseña actual es incorrecta', 400));
  }

  // Actualizar contraseña
  usuario.password = nuevaPassword;
  await usuario.save();

  // Generar nuevo token
  const token = generarToken(usuario);

  res.status(200).json({
    success: true,
    token,
    mensaje: 'Contraseña actualizada exitosamente'
  });
});

// @desc    Listar usuarios (para admin/RRHH)
// @route   GET /api/usuarios
// @access  Private (Admin/RRHH)
exports.listarUsuarios = asyncHandler(async (req, res, next) => {
  // Implementar paginación y filtros
  const usuarios = await Usuario.find()
    .populate('departamento', 'nombre')
    .select('-password');

  res.status(200).json({
    success: true,
    cantidad: usuarios.length,
    usuarios
  });
}); 