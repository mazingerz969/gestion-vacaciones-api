const express = require('express');
const router = express.Router();
const { 
  crearDepartamento,
  listarDepartamentos,
  obtenerDepartamento,
  actualizarDepartamento,
  eliminarDepartamento
} = require('../controllers/departamentoController');
const { 
  protegerRuta, 
  autorizarRoles 
} = require('../middleware/autenticacion');

// Rutas de departamentos
router.route('/')
  .get(
    protegerRuta, 
    autorizarRoles('admin', 'rrhh'), 
    listarDepartamentos
  )
  .post(
    protegerRuta, 
    autorizarRoles('admin', 'rrhh'), 
    crearDepartamento
  );

router.route('/:id')
  .get(
    protegerRuta, 
    autorizarRoles('admin', 'rrhh'), 
    obtenerDepartamento
  )
  .put(
    protegerRuta, 
    autorizarRoles('admin', 'rrhh'), 
    actualizarDepartamento
  )
  .delete(
    protegerRuta, 
    autorizarRoles('admin'), 
    eliminarDepartamento
  );

module.exports = router; 