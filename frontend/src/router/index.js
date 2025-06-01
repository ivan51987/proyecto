import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import SolicitudTutoria from '../components/SolicitudTutoria.vue'
import GestionTutorias from '../components/GestionTutorias.vue'
import ActualizarPerfil from '../components/ActualizarPerfil.vue'
import HistorialAcciones from '../components/HistorialAcciones.vue'
import BuscarTutor from '../components/BuscarTutor.vue'
import PerfilProyecto from '../components/PerfilProyecto.vue'
import CorreccionObservaciones from '../components/CorreccionObservaciones.vue'
import EntregaBorrador from '../components/EntregaBorrador.vue'
import InterfazSeguimientoProyecto from '../components/InterfazSeguimientoProyecto.vue'
import SolicitudTutoriaTutor from '../components/SolicitudTutoriaTutor.vue'
import EvaluacionPerfiles from '../components/EvaluacionPerfiles.vue'
import InterfazObservacionesPerfil from '../components/InterfazObservacionesPerfil.vue'
import EvaluacionBorrador from '../components/EvaluacionBorrador.vue'
import InterfazObservacionesBorrador from '../components/InterfazObservacionesBorrador.vue'
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
    component: Login
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/solicitar-tutoria',
    component: SolicitudTutoria
  },
  {
    path: '/gestionar-tutorias',
    component: GestionTutorias
  },
  {
    path: '/perfil',
    component: ActualizarPerfil
  },
  {
    path: '/historial',
    component: HistorialAcciones
  },
  {
    path: '/buscar-tutor',
    component: BuscarTutor
  },
  {
    path: '/perfil-proyecto',
    component: PerfilProyecto
  },
  {
    path: '/correccion-observaciones',
    component: CorreccionObservaciones
  },
  {
    path: '/entrega-borrador',
    component: EntregaBorrador
  },
  {
    path: '/seguimiento-proyecto',
    component: InterfazSeguimientoProyecto
  },
  {
    path: '/solicitud-tutoria-tutor',
    component: SolicitudTutoriaTutor
  },
  {
    path: '/evaluacion-perfiles',
    component: EvaluacionPerfiles
  },
  {
    path: '/interfaz-observaciones-perfiles',
    component: InterfazObservacionesPerfil
  },
  {
    path: '/evaluacion-borrador',
    component: EvaluacionBorrador
  },
  {
    path: '/interfaz-observaciones-borrador',
    component: InterfazObservacionesBorrador
  },
  {
    path: '/notificacion-observaciones',
    component: NotificacionObservaciones
  },
  {
    path: '/evaluacion-defensa',
    component: EvaluacionDefensa
  },
  {
    path: '/asignacion-tribunal',
    component: AsignacionTribunal
  },
  {
    path: '/asignacion-fecha-defensa',
    component: AsignacionFechaDefensa
  },
  {
    path: '/conclusion-proyecto',
    component: ConclusionProyecto
  },
  {
    path: '/seguimiento-proyecto-real-tiempo',
    component: SeguimientoProyectoRealTime
  },
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