const express = require('express');
const router = express.Router();
const { 
  crearSolicitudVacaciones,
  obtenerSolicitudesVacaciones,
  actualizarEstadoSolicitud,
  cancelarSolicitud
} = require('../controllers/solicitudVacacionesController');
const { 
  protegerRuta, 
  autorizarRoles 
} = require('../middleware/autenticacion');

// Rutas de solicitudes de vacaciones
router.route('/')
  .post(
    protegerRuta, 
    autorizarRoles('empleado'), 
    crearSolicitudVacaciones
  )
  .get(
    protegerRuta, 
    obtenerSolicitudesVacaciones
  );

router.route('/:id/estado')
  .put(
    protegerRuta, 
    autorizarRoles('gerente', 'rrhh'), 
    actualizarEstadoSolicitud
  );

router.route('/:id')
  .delete(
    protegerRuta, 
    autorizarRoles('empleado'), 
    cancelarSolicitud
  );

module.exports = router; 