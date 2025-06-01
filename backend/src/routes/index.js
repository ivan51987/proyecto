const express = require('express');
const router = express.Router();

// Importa y usa tus subrutas
router.use('/auth', require('./auth'));
router.use('/student', require('./student'));
/*router.use('/tutor', require('./tutor'));
router.use('/secretary', require('./secretary'));
router.use('/director', require('./director'));
router.use('/tribunal', require('./tribunal'));*/

module.exports = router;
