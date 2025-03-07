const mongoose = require('mongoose');

const SolicitudVacacionesSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'La solicitud debe tener un usuario asociado']
  },
  fechaInicio: {
    type: Date,
    required: [true, 'Por favor ingrese la fecha de inicio de vacaciones']
  },
  fechaFin: {
    type: Date,
    required: [true, 'Por favor ingrese la fecha de fin de vacaciones']
  },
  diasSolicitados: {
    type: Number,
    required: [true, 'Debe especificar el número de días solicitados']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente'
  },
  motivoRechazo: {
    type: String,
    trim: true
  },
  aprobadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Validación de fechas
SolicitudVacacionesSchema.pre('validate', function(next) {
  if (this.fechaInicio >= this.fechaFin) {
    next(new Error('La fecha de inicio debe ser anterior a la fecha de fin'));
  }
  next();
});

// Virtual para calcular días de vacaciones
SolicitudVacacionesSchema.virtual('duracion').get(function() {
  const diferencia = this.fechaFin - this.fechaInicio;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
});

module.exports = mongoose.model('SolicitudVacaciones', SolicitudVacacionesSchema); 