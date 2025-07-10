const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/me
router.get('/me', auth, getMe);

module.exports = router;