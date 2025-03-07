// server.js - Punto de entrada de la API
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a la base de datos
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Rutas API
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/departamentos', require('./routes/departamentos.routes'));
app.use('/api/solicitudes', require('./routes/solicitudes.routes'));
app.use('/api/vacaciones', require('./routes/vacaciones.routes'));
app.use('/api/calendario', require('./routes/calendario.routes'));
app.use('/api/notificaciones', require('./routes/notificaciones.routes'));

// Ruta para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'API de Gestión de Vacaciones funcionando' });
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : err.message,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});


// models/Usuario.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor ingrese un email válido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    departamento_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Departamento',
      required: [true, 'El departamento es obligatorio'],
    },
    rol: {
      type: String,
      enum: ['empleado', 'manager', 'rrhh', 'admin'],
      default: 'empleado',
    },
    fecha_alta: {
      type: Date,
      default: Date.now,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    supervisor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
  },
  {
    timestamps: true,
  }
);

// Método para cifrar la contraseña antes de guardar
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
UsuarioSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Método para generar el nombre completo
UsuarioSchema.virtual('nombreCompleto').get(function () {
  return `${this.nombre} ${this.apellido}`;
});

module.exports = mongoose.model('Usuario', UsuarioSchema);


// models/SolicitudVacaciones.model.js
const mongoose = require('mongoose');

const SolicitudVacacionesSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuario es obligatorio'],
    },
    fecha_solicitud: {
      type: Date,
      default: Date.now,
    },
    fecha_inicio: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria'],
    },
    fecha_fin: {
      type: Date,
      required: [true, 'La fecha de fin es obligatoria'],
    },
    dias_laborables: {
      type: Number,
      required: [true, 'El número de días laborables es obligatorio'],
    },
    tipo: {
      type: String,
      enum: ['vacaciones', 'enfermedad', 'permiso', 'otros'],
      default: 'vacaciones',
    },
    comentario: {
      type: String,
      trim: true,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
      default: 'pendiente',
    },
    aprobador_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
    },
    fecha_aprobacion: {
      type: Date,
    },
    comentario_respuesta: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para validar fechas
SolicitudVacacionesSchema.pre('save', function (next) {
  if (this.fecha_inicio > this.fecha_fin) {
    next(new Error('La fecha de inicio no puede ser posterior a la fecha de fin'));
  }
  next();
});

module.exports = mongoose.model('SolicitudVacaciones', SolicitudVacacionesSchema);


// controllers/solicitudes.controller.js
const SolicitudVacaciones = require('../models/SolicitudVacaciones.model');
const AsignacionVacaciones = require('../models/AsignacionVacaciones.model');
const Usuario = require('../models/Usuario.model');
const Notificacion = require('../models/Notificacion.model');
const calcularDiasLaborables = require('../utils/calcularDiasLaborables');

// Obtener todas las solicitudes (filtradas según el rol del usuario)
exports.getSolicitudes = async (req, res) => {
  try {
    const { usuario } = req;
    let query = {};

    // Filtrar según el rol
    if (usuario.rol === 'empleado') {
      // Empleados solo ven sus propias solicitudes
      query.usuario_id = usuario._id;
    } else if (usuario.rol === 'manager') {
      // Managers ven solicitudes de sus subordinados
      const subordinados = await Usuario.find({ supervisor_id: usuario._id });
      const subordinadosIds = subordinados.map(sub => sub._id);
      query.usuario_id = { $in: subordinadosIds };
    }
    // RRHH y admin ven todas las solicitudes (no se aplica filtro)

    const solicitudes = await SolicitudVacaciones.find(query)
      .populate('usuario_id', 'nombre apellido email')
      .populate('aprobador_id', 'nombre apellido')
      .sort({ fecha_solicitud: -1 });

    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva solicitud
exports.crearSolicitud = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, tipo, comentario } = req.body;
    const usuario_id = req.usuario._id;

    // Calcular días laborables entre las fechas
    const dias_laborables = await calcularDiasLaborables(fecha_inicio, fecha_fin);

    // Verificar disponibilidad de días si es vacaciones
    if (tipo === 'vacaciones') {
      const anioActual = new Date().getFullYear();
      const asignacion = await AsignacionVacaciones.findOne({
        usuario_id,
        anio: anioActual,
      });

      if (!asignacion) {
        return res.status(400).json({
          message: 'No tienes asignación de vacaciones para el año actual',
        });
      }

      // Obtener días ya utilizados en solicitudes aprobadas
      const solicitudesAprobadas = await SolicitudVacaciones.find({
        usuario_id,
        tipo: 'vacaciones',
        estado: 'aprobada',
        $or: [
          { fecha_inicio: { $gte: new Date(anioActual, 0, 1) } },
          { fecha_fin: { $gte: new Date(anioActual, 0, 1) } },
        ],
      });

      const diasUsados = solicitudesAprobadas.reduce(
        (total, solicitud) => total + solicitud.dias_laborables,
        0
      );

      // Verificar si tiene suficientes días disponibles
      if (diasUsados + dias_laborables > asignacion.dias_totales) {
        return res.status(400).json({
          message: 'No tienes suficientes días de vacaciones disponibles',
          diasDisponibles: asignacion.dias_totales - diasUsados,
          diasSolicitados: dias_laborables,
        });
      }
    }

    // Crear la solicitud
    const nuevaSolicitud = new SolicitudVacaciones({
      usuario_id,
      fecha_inicio,
      fecha_fin,
      dias_laborables,
      tipo,
      comentario,
    });

    await nuevaSolicitud.save();

    // Enviar notificación al supervisor
    const usuario = await Usuario.findById(usuario_id);
    if (usuario.supervisor_id) {
      const nuevaNotificacion = new Notificacion({
        usuario_id: usuario.supervisor_id,
        tipo: 'solicitud',
        mensaje: `${usuario.nombre} ${usuario.apellido} ha solicitado ${dias_laborables} días de ${tipo}`,
        referencia_id: nuevaSolicitud._id,
      });
      await nuevaNotificacion.save();
    }

    res.status(201).json(nuevaSolicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Aprobar o rechazar una solicitud
exports.responderSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, comentario_respuesta } = req.body;
    const aprobador_id = req.usuario._id;

    // Verificar que el estado sea válido
    if (!['aprobada', 'rechazada'].includes(estado)) {
      return res.status(400).json({
        message: 'El estado debe ser "aprobada" o "rechazada"',
      });
    }

    // Verificar permisos
    const solicitud = await SolicitudVacaciones.findById(id).populate('usuario_id');
    if (!solicitud) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    const usuario = await Usuario.findById(req.usuario._id);
    const esAutorizado =
      usuario.rol === 'admin' ||
      usuario.rol === 'rrhh' ||
      (usuario.rol === 'manager' &&
        solicitud.usuario_id.supervisor_id &&
        solicitud.usuario_id.supervisor_id.toString() === usuario._id.toString());

    if (!esAutorizado) {
      return res.status(403).json({
        message: 'No tienes permiso para responder a esta solicitud',
      });
    }

    // Actualizar la solicitud
    solicitud.estado = estado;
    solicitud.aprobador_id = aprobador_id;
    solicitud.fecha_aprobacion = Date.now();
    solicitud.comentario_respuesta = comentario_respuesta;

    await solicitud.save();

    // Enviar notificación al usuario
    const nuevaNotificacion = new Notificacion({
      usuario_id: solicitud.usuario_id._id,
      tipo: 'aprobacion',
      mensaje: `Tu solicitud de ${solicitud.tipo} ha sido ${estado === 'aprobada' ? 'aprobada' : 'rechazada'}`,
      referencia_id: solicitud._id,
    });
    await nuevaNotificacion.save();

    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
