const express = require("express");
const router = express.Router();
const controller = require("../controllers/docentes.controller");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");


// Proporcionar observaciones a borrador
router.put("/observaciones-borrador", auth, roles("proporcionarObservacionesBorrador"), controller.proporcionarObservaciones);

// Notificar observaciones
router.post("/notificar-estudiante", auth, roles("notificarObservacionesEstudiante"), controller.notificarObservaciones);

// Evaluar defensa
router.post("/evaluar-defensa", auth, roles("evaluarDefensaFinal"), controller.evaluarDefensa);

// Aceptar o rechazar solicitud
router.put("/solicitud", auth, roles("aceptarSolicitudTutoria"), controller.aceptarORechazarSolicitudTutoria);

// Ver proyectos asignados
router.get("/proyectos", auth, roles("guiarEstudianteProyecto"), controller.listarProyectosAsignados);

// Evaluar perfil de proyecto
router.put("/evaluar-perfil", auth, roles("evaluarPerfilProyecto"), controller.evaluarPerfil);

// Listar proyectos solicitud de tutoría
router.get("/solicitud-proyecto-tutoria", auth, roles("solicitudProyectoTutoria"), controller.listarProyectosSolicitudTutoria);

// Listar proyectos asignados tribunal
router.get("/proyectos-asignados-tribunal", auth, roles("solicitudProyectoTutoria"), controller.listarProyectosAsignadoTribunal);

// Listar proyectos historial observar
router.get("/proyectos-historial-observar", auth, roles("solicitudProyectoTutoria"), controller.listarProyectosHistorialObservar);

// Registrar evaluacion de perfil del proyecto
router.post("/registrar-perfil-proyecto", auth, controller.registrarEvaluacionPerfil);

// Listar proyectos historial observar
router.get("/proyectos-historial-observar-borrador", auth, roles("solicitudProyectoTutoria"), controller.listarProyectosHistorialObservarBorrador);

// Registrar evaluacion de borrador del proyecto
router.post("/registrar-borrador-proyecto", auth, controller.registrarEvaluacionBorrador);

// Listar proyectos aprobador del borrador
router.get("/proyectos-aprobador-borrador", auth, controller.listarProyectosAprobadorBorrador);
//lista proyecto historial
router.get("/lista-proyecto-historial", auth, controller.listarHistorialProyecto);

module.exports = router;
