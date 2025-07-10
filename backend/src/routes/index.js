const express = require('express');
const router = express.Router();

// Importa y usa tus subrutas
router.use('/auth', require('./auth'));
router.use('/estudiantes', require('./estudiantes'));
router.use('/docentes', require('./docentes'));
router.use('/secretaria', require('./secretaria'));
router.use('/directores', require('./directores'));
router.use('/', require('./materias'));
module.exports = router;
