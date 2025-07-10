const express = require("express");
const router = express.Router();
const controller = require("../controllers/tutores.controller");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

// Aceptar o rechazar solicitud
router.put("/solicitud", auth, roles("aceptarSolicitudTutoria"), controller.aceptarSolicitud);

// Ver proyectos asignados
router.get("/proyectos", auth, roles("guiarEstudianteProyecto"), controller.listarProyectosAsignados);

// Evaluar perfil de proyecto
router.put("/evaluar-perfil", auth, roles("evaluarPerfilProyecto"), controller.evaluarPerfil);

module.exports = router;
