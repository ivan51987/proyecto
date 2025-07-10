import { createRouter, createWebHistory } from "vue-router";

// Vistas principales
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

// Estudiantes
import SolicitudTutoria from "../components/SolicitudTutoria.vue";
import ActualizarPerfil from "../components/ActualizarPerfil.vue";
import HistorialAcciones from "../components/HistorialAcciones.vue";
import BuscarTutor from "../components/BuscarTutor.vue";
import PerfilProyecto from "../components/PerfilProyecto.vue";
import CorreccionObservaciones from "../components/CorreccionObservaciones.vue";
import EntregaBorrador from "../components/EntregaBorrador.vue";
import SeguimientoProyecto from "../components/SeguimientoProyecto.vue";

// docentes
import SolicitudTutoriaTutor from "../components/docente/SolicitudTutoriaTutor.vue";
import GestionTutorias from "../components/docente/GestionTutorias.vue";
import EvaluacionPerfiles from "../components/docente/EvaluacionPerfiles.vue";
import ObservacionesPerfil from "../components/docente/ObservacionesPerfil.vue";
import EvaluacionBorrador from "../components/docente/EvaluacionBorrador.vue";
import ObservacionesBorrador from "../components/docente/ObservacionesBorrador.vue";
import EvaluacionDefensa from "../components/docente/EvaluacionDefensa.vue";
import ConclusionProyecto from "../components/docente/ConclusionProyecto.vue";
import SeguimientoProyectoRealTime from "../components/director/SeguimientoProyectoRealTime.vue";

//Director
import AsignacionTribunal from "../components/director/AsignacionTribunal.vue";
import RegistrarConclusion from "../components/director/RegistrarConclusion.vue";
import Reportes from "../components/director/Reportes.vue";
import CronogramaDefensas from "../components/director/CronogramaDefensas.vue";

import NotificacionObservaciones from "../components/NotificacionObservaciones.vue";
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
  },

  // Estudiante
  {
    path: "/solicitar-tutoria",
    name: "SolicitudTutoria",
    component: SolicitudTutoria,
  },
  {
    path: "/perfil",
    name: "ActualizarPerfil",
    component: ActualizarPerfil,
  },
  {
    path: "/historial",
    name: "HistorialAcciones",
    component: HistorialAcciones,
  },
  {
    path: "/buscar-tutor",
    name: "BuscarTutor",
    component: BuscarTutor,
  },
  {
    path: "/perfil-proyecto",
    name: "PerfilProyecto",
    component: PerfilProyecto,
  },
  {
    path: "/correccion-observaciones",
    name: "CorreccionObservaciones",
    component: CorreccionObservaciones,
  },
  {
    path: "/entrega-borrador",
    name: "EntregaBorrador",
    component: EntregaBorrador,
  },
  {
    path: "/seguimiento-proyecto",
    name: "SeguimientoProyecto",
    component: SeguimientoProyecto,
  },

  // docente
  {
    path: "/aceptar-solicitudes",
    name: "SolicitudTutoriaTutor",
    component: SolicitudTutoriaTutor,
  },
  {
    path: "/gestionar-tutorias",
    name: "GestionTutorias",
    component: GestionTutorias,
  },
  {
    path: "/evaluar-perfil",
    name: "EvaluacionPerfiles",
    component: EvaluacionPerfiles,
  },
  {
    path: "/observaciones-perfiles",
    name: "ObservacionesPerfil",
    component: ObservacionesPerfil,
  },
  {
    path: "/observaciones-borrador",
    name: "ObservacionesBorrador",
    component: ObservacionesBorrador,
  },
  {
    path: "/evaluar-borrador",
    name: "EvaluacionBorrador",
    component: EvaluacionBorrador,
  },  
  {
    path: "/evaluacion-defensa",
    name: "EvaluacionDefensa",
    component: EvaluacionDefensa,
  },
  {
    path: "/notificacion-observaciones",
    name: "NotificacionObservaciones",
    component: NotificacionObservaciones,
  },

  // director
  {
    path: "/asignar-tribunal",
    name: "AsignarTribunal",
    component: AsignacionTribunal,
  },
  {
    path: "/cronograma-defensas",
    name: "CronogramaDefensas",
    component: CronogramaDefensas,
  },
  {
    path: "/registrar-conclusion",
    name: "RegistrarConclusion",
    component: RegistrarConclusion,
  },
  {
    path: "/conclusion-proyecto",
    name: "ConclusionProyecto",
    component: ConclusionProyecto,
  },

  {
    path: "/generar-reporte",
    name: "GenerarReporte",
    component: Reportes,
  },
  {
    path: "/seguimiento-proyecto-real-tiempo",
    name: "SeguimientoProyectoRealTime",
    component: SeguimientoProyectoRealTime,
  },

  // Ruta no encontrada
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
