const express = require("express");
const router = express.Router();
const controller = require("../controllers/estudiantes.controller");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");
const upload = require("../middlewares/archivo");
// Aplicar permisos por ruta
router.get("/buscar-tutores", auth, roles("buscarTutor"), controller.buscarTutores);
router.post("/enviar-solicitud", auth, roles("enviarSolicitudTutoria"), upload.single("documento"), controller.enviarSolicitudTutoria);
router.post("/crear-proyecto", auth, roles("registrarFechaInicioProyecto"), controller.crearProyecto);
router.post("/presentar-perfil", auth, roles("presentarPerfilProyecto"), upload.single("documento"), controller.presentarPerfil);
router.put("/corregir-perfil", auth, roles("corregirObservacionesPerfil"), controller.corregirPerfil);
router.post("/entregar-borrador", auth, roles("entregarBorradorProyecto"), controller.entregarBorrador);
router.put("/corregir-borrador", auth, roles("corregirBorradorObservaciones"), controller.corregirBorrador);
router.get("/historial", auth, controller.historialAcciones); // opcional sin roles

module.exports = router;
