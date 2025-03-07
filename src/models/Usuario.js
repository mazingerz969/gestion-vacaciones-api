const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'Por favor ingrese su nombre'],
    trim: true
  },
  apellido: {
    type: String,
    required: [true, 'Por favor ingrese su apellido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese su correo electrónico'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor ingrese un correo electrónico válido'
    ]
  },
  password: {
    type: String,
    required: [true, 'Por favor ingrese una contraseña'],
    minlength: 6,
    select: false
  },
  rol: {
    type: String,
    enum: ['empleado', 'gerente', 'rrhh', 'admin'],
    default: 'empleado'
  },
  departamento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento'
  },
  diasVacacionesDisponibles: {
    type: Number,
    default: 22
  },
  fechaIngreso: {
    type: Date,
    default: Date.now
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

// Middleware para hashear contraseña antes de guardar
UsuarioSchema.pre('save', async function(next) {
  // Solo hashear la contraseña si ha sido modificada
  if (!this.isModified('password')) return next();

  // Generar salt y hashear
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
UsuarioSchema.methods.compararPassword = async function(passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Virtual para nombre completo
UsuarioSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombre} ${this.apellido}`;
});

module.exports = mongoose.model('Usuario', UsuarioSchema); 