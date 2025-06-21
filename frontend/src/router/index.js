import { createRouter, createWebHistory } from 'vue-router'

// Vistas principales
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'

// Estudiantes
import SolicitudTutoria from '../components/SolicitudTutoria.vue'
import ActualizarPerfil from '../components/ActualizarPerfil.vue'
import HistorialAcciones from '../components/HistorialAcciones.vue'
import BuscarTutor from '../components/BuscarTutor.vue'
import PerfilProyecto from '../components/PerfilProyecto.vue'
import CorreccionObservaciones from '../components/CorreccionObservaciones.vue'
import EntregaBorrador from '../components/EntregaBorrador.vue'
import InterfazSeguimientoProyecto from '../components/InterfazSeguimientoProyecto.vue'

// Tutores
import SolicitudTutoriaTutor from '../components/SolicitudTutoriaTutor.vue'
import GestionTutorias from '../components/GestionTutorias.vue'
import EvaluacionPerfiles from '../components/EvaluacionPerfiles.vue'
import InterfazObservacionesPerfil from '../components/InterfazObservacionesPerfil.vue'
import EvaluacionBorrador from '../components/EvaluacionBorrador.vue'
import InterfazObservacionesBorrador from '../components/InterfazObservacionesBorrador.vue'

// Tribunales
import NotificacionObservaciones from '../components/NotificacionObservaciones.vue'
import EvaluacionDefensa from '../components/EvaluacionDefensa.vue'
import AsignacionTribunal from '../components/AsignacionTribunal.vue'
import AsignacionFechaDefensa from '../components/AsignacionFechaDefensa.vue'
import ConclusionProyecto from '../components/ConclusionProyecto.vue'
import SeguimientoProyectoRealTime from '../components/SeguimientoProyectoRealTime.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard
  },

  // Estudiante
  {
    path: '/solicitar-tutoria',
    name: 'SolicitudTutoria',
    component: SolicitudTutoria
  },
  {
    path: '/perfil',
    name: 'ActualizarPerfil',
    component: ActualizarPerfil
  },
  {
    path: '/historial',
    name: 'HistorialAcciones',
    component: HistorialAcciones
  },
  {
    path: '/buscar-tutor',
    name: 'BuscarTutor',
    component: BuscarTutor
  },
  {
    path: '/perfil-proyecto',
    name: 'PerfilProyecto',
    component: PerfilProyecto
  },
  {
    path: '/correccion-observaciones',
    name: 'CorreccionObservaciones',
    component: CorreccionObservaciones
  },
  {
    path: '/entrega-borrador',
    name: 'EntregaBorrador',
    component: EntregaBorrador
  },
  {
    path: '/seguimiento-proyecto',
    name: 'InterfazSeguimientoProyecto',
    component: InterfazSeguimientoProyecto
  },

  // Tutor
  {
    path: '/aceptar-solicitudes',
    name: 'SolicitudTutoriaTutor',
    component: SolicitudTutoriaTutor
  },
  {
    path: '/gestionar-tutorias',
    name: 'GestionTutorias',
    component: GestionTutorias
  },
  {
    path: '/evaluar-perfil',
    name: 'EvaluacionPerfiles',
    component: EvaluacionPerfiles
  },
  {
    path: '/interfaz-observaciones-perfiles',
    name: 'InterfazObservacionesPerfil',
    component: InterfazObservacionesPerfil
  },
  {
    path: '/evaluacion-borrador',
    name: 'EvaluacionBorrador',
    component: EvaluacionBorrador
  },
  {
    path: '/interfaz-observaciones-borrador',
    name: 'InterfazObservacionesBorrador',
    component: InterfazObservacionesBorrador
  },

  // Tribunal
  {
    path: '/notificacion-observaciones',
    name: 'NotificacionObservaciones',
    component: NotificacionObservaciones
  },
  {
    path: '/evaluacion-defensa',
    name: 'EvaluacionDefensa',
    component: EvaluacionDefensa
  },
  {
    path: '/asignacion-tribunal',
    name: 'AsignacionTribunal',
    component: AsignacionTribunal
  },
  {
    path: '/asignacion-fecha-defensa',
    name: 'AsignacionFechaDefensa',
    component: AsignacionFechaDefensa
  },
  {
    path: '/conclusion-proyecto',
    name: 'ConclusionProyecto',
    component: ConclusionProyecto
  },
  {
    path: '/seguimiento-proyecto-real-tiempo',
    name: 'SeguimientoProyectoRealTime',
    component: SeguimientoProyectoRealTime
  },

  // Ruta no encontrada
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
