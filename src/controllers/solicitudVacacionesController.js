const SolicitudVacaciones = require('../models/SolicitudVacaciones');
const Usuario = require('../models/Usuario');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Crear nueva solicitud de vacaciones
// @route   POST /api/solicitudes-vacaciones
// @access  Private (Empleado)
exports.crearSolicitudVacaciones = asyncHandler(async (req, res, next) => {
  const { fechaInicio, fechaFin, diasSolicitados } = req.body;
  const usuario = req.usuario;

  // Verificar días de vacaciones disponibles
  if (diasSolicitados > usuario.diasVacacionesDisponibles) {
    return next(new ErrorResponse('No tiene suficientes días de vacaciones disponibles', 400));
  }

  // Verificar solicitudes existentes en el mismo rango de fechas
  const solicitudesExistentes = await SolicitudVacaciones.find({
    usuario: usuario._id,
    $or: [
      { 
        fechaInicio: { $lte: fechaFin },
        fechaFin: { $gte: fechaInicio }
      }
    ],
    estado: { $ne: 'rechazada' }
  });

  if (solicitudesExistentes.length > 0) {
    return next(new ErrorResponse('Ya tiene una solicitud de vacaciones en este rango de fechas', 400));
  }

  // Crear nueva solicitud
  const solicitud = await SolicitudVacaciones.create({
    usuario: usuario._id,
    fechaInicio,
    fechaFin,
    diasSolicitados
  });

  res.status(201).json({
    success: true,
    solicitud
  });
});

// @desc    Obtener solicitudes de vacaciones del usuario
// @route   GET /api/solicitudes-vacaciones
// @access  Private
exports.obtenerSolicitudesVacaciones = asyncHandler(async (req, res, next) => {
  let query = {};

  // Si es empleado, solo ve sus propias solicitudes
  if (req.usuario.rol === 'empleado') {
    query.usuario = req.usuario._id;
  } 
  // Si es gerente, ve las solicitudes de su departamento
  else if (req.usuario.rol === 'gerente') {
    const usuariosDelDepartamento = await Usuario.find({ 
      departamento: req.usuario.departamento 
    }).select('_id');
    
    query.usuario = { $in: usuariosDelDepartamento.map(u => u._id) };
  }
  // Si es admin o RRHH, ve todas las solicitudes

  // Implementar paginación
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const solicitudes = await SolicitudVacaciones.find(query)
    .populate('usuario', 'nombre apellido email')
    .populate('aprobadoPor', 'nombre apellido')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await SolicitudVacaciones.countDocuments(query);

  res.status(200).json({
    success: true,
    cantidad: solicitudes.length,
    total,
    pagina: page,
    totalPaginas: Math.ceil(total / limit),
    solicitudes
  });
});

// @desc    Aprobar/Rechazar solicitud de vacaciones
// @route   PUT /api/solicitudes-vacaciones/:id/estado
// @access  Private (Gerente/RRHH)
exports.actualizarEstadoSolicitud = asyncHandler(async (req, res, next) => {
  const { estado, motivoRechazo } = req.body;
  const solicitud = await SolicitudVacaciones.findById(req.params.id);

  // Verificar si la solicitud existe
  if (!solicitud) {
    return next(new ErrorResponse(`Solicitud no encontrada con ID ${req.params.id}`, 404));
  }

  // Verificar estado válido
  if (!['pendiente', 'aprobada', 'rechazada'].includes(estado)) {
    return next(new ErrorResponse('Estado de solicitud inválido', 400));
  }

  // Actualizar solicitud
  solicitud.estado = estado;
  solicitud.aprobadoPor = req.usuario._id;

  // Si es rechazada, agregar motivo
  if (estado === 'rechazada') {
    solicitud.motivoRechazo = motivoRechazo || 'Sin motivo especificado';
  }

  // Si es aprobada, descontar días de vacaciones
  if (estado === 'aprobada') {
    const usuario = await Usuario.findById(solicitud.usuario);
    usuario.diasVacacionesDisponibles -= solicitud.diasSolicitados;
    await usuario.save();
  }

  await solicitud.save();

  res.status(200).json({
    success: true,
    solicitud
  });
});

// @desc    Cancelar solicitud de vacaciones
// @route   DELETE /api/solicitudes-vacaciones/:id
// @access  Private (Empleado)
exports.cancelarSolicitud = asyncHandler(async (req, res, next) => {
  const solicitud = await SolicitudVacaciones.findById(req.params.id);

  // Verificar si la solicitud existe
  if (!solicitud) {
    return next(new ErrorResponse(`Solicitud no encontrada con ID ${req.params.id}`, 404));
  }

  // Verificar que solo el dueño pueda cancelar
  if (solicitud.usuario.toString() !== req.usuario._id.toString()) {
    return next(new ErrorResponse('No autorizado para cancelar esta solicitud', 403));
  }

  // Verificar que la solicitud esté pendiente
  if (solicitud.estado !== 'pendiente') {
    return next(new ErrorResponse('Solo se pueden cancelar solicitudes pendientes', 400));
  }

  // Eliminar solicitud
  await solicitud.remove();

  res.status(200).json({
    success: true,
    message: 'Solicitud de vacaciones cancelada exitosamente'
  });
}); 