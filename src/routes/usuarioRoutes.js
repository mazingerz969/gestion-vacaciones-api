const express = require('express');
const router = express.Router();
const { 
  registrarUsuario, 
  login, 
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  listarUsuarios
} = require('../controllers/usuarioController');
const { 
  protegerRuta, 
  autorizarRoles 
} = require('../middleware/autenticacion');

// Rutas públicas
router.post('/registro', registrarUsuario);
router.post('/login', login);

// Rutas privadas
router.get('/perfil', protegerRuta, obtenerPerfil);
router.put('/perfil', protegerRuta, actualizarPerfil);
router.put('/cambiar-password', protegerRuta, cambiarPassword);

// Rutas de administración
router.get('/', 
  protegerRuta, 
  autorizarRoles('admin', 'rrhh'), 
  listarUsuarios
);

module.exports = router; 