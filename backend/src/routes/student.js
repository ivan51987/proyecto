const express = require('express');
const router = express.Router();
const { 
  presentarTema, 
  consultarAprobacion,
  // ... otros métodos
} = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');

// @route   POST /api/student/presentar-tema
router.post(
  '/presentar-tema', 
  auth, 
  roles('presentarTema'), 
  presentarTema
);

// @route   GET /api/student/consultar-aprobacion/:temaId
router.get(
  '/consultar-aprobacion/:temaId', 
  auth, 
  roles('consultarAprobacionTema'), 
  consultarAprobacion
);

// Implementar el resto de rutas según el diagrama...

module.exports = router;