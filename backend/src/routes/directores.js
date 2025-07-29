const express = require("express");
const router = express.Router();
const directorController = require("../controllers/directores.controller");
const auth = require("../middlewares/auth");
const roles = require("../middlewares/roles");

router.post("/registrar-conclusion", auth, roles("registrarConclusionProyecto"), directorController.registrarConclusion);
router.post("/asignar-defensa", auth, roles("asignarFechaHoraDefensa"), directorController.asignarDefensa);
router.post("/asignar-tribunal", auth, roles("asignarTribunalEvaluador"), directorController.asignarTribunal);
router.get("/generar-reporte", auth, roles("generarReportes"), directorController.generarReporte);
router.get("/listar-proyectos", auth, directorController.listarProyectos);
router.get("/listar-proyectos-para-defender", auth, directorController.listarProyectosParaDefender);
router.post("/registrar-defensa", auth, directorController.registrarDefensa);
router.get("/listar-defensas-programadas", auth, directorController.listarDefensasProgramadas);
router.get("/listar-proyectos-para-seguimiento", auth, directorController.listaSeguimientoProyectos);
router.get("/listar-historico-proyectos", auth, directorController.listaHistoricoProyectos);


module.exports = router;
