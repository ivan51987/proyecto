const express = require("express");
const router = express.Router();
const controller = require("../controllers/secretaria.controller");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

// Seguimiento de proyectos en tiempo real
router.get("/seguimiento-tiempo-real", auth, roles("seguimientoTiempoReal"), controller.seguimientoTiempoReal);

module.exports = router;
