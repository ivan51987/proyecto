const express = require("express");
const router = express.Router();
const controller = require("../controllers/materias.controller");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

// Aplicar permisos por ruta
router.get("/materias", auth, roles("buscarTutor"), controller.materias);
router.get("/docentes", auth, controller.docentes);

module.exports = router;