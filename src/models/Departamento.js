const mongoose = require('mongoose');

const DepartamentoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese el nombre del departamento'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  responsable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  ubicacion: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual para obtener el número de empleados
DepartamentoSchema.virtual('numeroEmpleados', {
  ref: 'Usuario',
  localField: '_id',
  foreignField: 'departamento',
  count: true
});

module.exports = mongoose.model('Departamento', DepartamentoSchema); 