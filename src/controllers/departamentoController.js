const Departamento = require('../models/Departamento');
const Usuario = require('../models/Usuario');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Crear nuevo departamento
// @route   POST /api/departamentos
// @access  Private (Admin/RRHH)
exports.crearDepartamento = asyncHandler(async (req, res, next) => {
  const { nombre, descripcion, ubicacion, responsable } = req.body;

  // Verificar si el departamento ya existe
  const departamentoExistente = await Departamento.findOne({ nombre });
  if (departamentoExistente) {
    return next(new ErrorResponse('El departamento ya existe', 400));
  }

  // Verificar si el responsable existe
  if (responsable) {
    const usuarioResponsable = await Usuario.findById(responsable);
    if (!usuarioResponsable) {
      return next(new ErrorResponse('Responsable no encontrado', 404));
    }
  }

  // Crear nuevo departamento
  const departamento = await Departamento.create({
    nombre,
    descripcion,
    ubicacion,
    responsable
  });

  res.status(201).json({
    success: true,
    departamento
  });
});

// @desc    Obtener todos los departamentos
// @route   GET /api/departamentos
// @access  Private (Admin/RRHH)
exports.listarDepartamentos = asyncHandler(async (req, res, next) => {
  // Implementar paginación y filtros
  const departamentos = await Departamento.find()
    .populate('responsable', 'nombre apellido email')
    .populate('numeroEmpleados');

  res.status(200).json({
    success: true,
    cantidad: departamentos.length,
    departamentos
  });
});

// @desc    Obtener un departamento por ID
// @route   GET /api/departamentos/:id
// @access  Private (Admin/RRHH)
exports.obtenerDepartamento = asyncHandler(async (req, res, next) => {
  const departamento = await Departamento.findById(req.params.id)
    .populate('responsable', 'nombre apellido email')
    .populate({
      path: 'empleados',
      model: 'Usuario',
      select: 'nombre apellido email rol'
    });

  if (!departamento) {
    return next(new ErrorResponse(`Departamento no encontrado con ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    departamento
  });
});

// @desc    Actualizar departamento
// @route   PUT /api/departamentos/:id
// @access  Private (Admin/RRHH)
exports.actualizarDepartamento = asyncHandler(async (req, res, next) => {
  const { nombre, descripcion, ubicacion, responsable } = req.body;

  // Verificar si el responsable existe
  if (responsable) {
    const usuarioResponsable = await Usuario.findById(responsable);
    if (!usuarioResponsable) {
      return next(new ErrorResponse('Responsable no encontrado', 404));
    }
  }

  const departamento = await Departamento.findByIdAndUpdate(
    req.params.id, 
    { nombre, descripcion, ubicacion, responsable }, 
    { 
      new: true, 
      runValidators: true 
    }
  );

  if (!departamento) {
    return next(new ErrorResponse(`Departamento no encontrado con ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    departamento
  });
});

// @desc    Eliminar departamento
// @route   DELETE /api/departamentos/:id
// @access  Private (Admin)
exports.eliminarDepartamento = asyncHandler(async (req, res, next) => {
  // Verificar si hay usuarios en el departamento
  const usuariosEnDepartamento = await Usuario.countDocuments({ departamento: req.params.id });
  
  if (usuariosEnDepartamento > 0) {
    return next(new ErrorResponse('No se puede eliminar un departamento con usuarios asignados', 400));
  }

  const departamento = await Departamento.findByIdAndDelete(req.params.id);

  if (!departamento) {
    return next(new ErrorResponse(`Departamento no encontrado con ID ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Departamento eliminado exitosamente'
  });
}); 