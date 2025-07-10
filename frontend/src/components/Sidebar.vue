<template>
  <aside :class="[
    'fixed inset-y-0 left-0 bg-white shadow-lg max-h-screen w-60 transform transition-transform duration-300 ease-in-out',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
  ]">
    <div class="flex flex-col justify-between h-full">
      <div class="flex-grow overflow-y-auto">
        <div class="px-4 py-6 text-center border-b">
          <h1 class="text-xl font-bold leading-none text-primary-700">
            <span class="text-primary-500">Mi</span> Aplicación
          </h1>
        </div>
        <div class="p-4">
          <ul class="space-y-1">
            <li v-for="item in filteredMenuItems" :key="item.to">
              <router-link :to="item.to" class="flex items-center rounded-xl font-bold text-sm py-3 px-4" :class="[
                $route.path === item.to
                  ? 'bg-primary-100 text-primary-900'
                  : 'text-gray-600 hover:bg-gray-100',
              ]">
                <component :is="item.icon" class="h-5 w-5 mr-3" />
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/useAuthStore";
import {
  HomeIcon, // Dashboard
  UserIcon, // Buscar Tutor, Perfiles
  UserGroupIcon, // Asignación Tribunal, Grupos
  DocumentTextIcon, // Perfil Proyecto, Documentos
  DocumentArrowUpIcon, // Entregas
  DocumentCheckIcon, // Aprobaciones, Correcciones
  //DocumentDuplicateIcon, // Comprobantes
  AcademicCapIcon, // Tutorías, Defensas
  ClockIcon, // Historial
  CalendarIcon, // Fechas, Calendario
  DocumentDuplicateIcon, // Aprobación de temas
  // DocumentDuplicateIcon, // Observaciones, Listados
  ChartBarIcon, // Seguimiento
  FlagIcon, // Conclusión
  EnvelopeIcon, // Notificaciones
  MagnifyingGlassIcon, // Búsquedas
  PencilSquareIcon, // Edición, Correcciones
  BookOpenIcon, // Proyectos, Documentación
  CheckCircleIcon, // Evaluaciones positivas
  ExclamationCircleIcon, // Observaciones
  ArrowPathIcon, // Reentregas, Actualizaciones
  ChevronRightIcon, // Para submenús
  ChevronDownIcon, // Para submenús
  BuildingLibraryIcon, // Tribunal, Institución
  BriefcaseIcon, // Proyectos profesionales
  ChatBubbleLeftRightIcon, // Comunicaciones
  WrenchScrewdriverIcon, // Ajustes, Configuraciones
  ArrowTrendingUpIcon, // Progreso, Seguimiento
  ClipboardDocumentCheckIcon, 
  CalendarDaysIcon,                     
  DocumentChartBarIcon       
} from "@heroicons/vue/24/outline";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const authStore = useAuthStore();
console.log(authStore.user?.role);

const allMenuItems = [
  // Común
  {
    to: "/dashboard",
    title: "Dashboard",
    icon: HomeIcon,
    roles: ["estudiante", "docente", "secretaria", "director"],
    permissions: [],
  },

  // Estudiante
  {
    to: "/perfil-proyecto",
    title: "Registrar Proyecto",
    icon: CalendarIcon,
    roles: ["estudiante"],
    permissions: ["registrarFechaInicioProyecto"],
  },
  {
    to: "/buscar-tutor",
    title: "Buscar Tutor",
    icon: DocumentTextIcon,
    roles: ["estudiante"],
    permissions: ["buscarTutor"],
  },

  {
    to: "/presentar-perfil",
    title: "Presentar Perfil Proyecto",
    icon: DocumentTextIcon,
    roles: ["estudiante"],
    permissions: ["presentarPerfilProyecto"],
  },
  {
    to: "/corregir-perfil",
    title: "Corregir Observaciones Perfil",
    icon: PencilSquareIcon,
    roles: ["estudiante"],
    permissions: ["corregirObservacionesPerfil"],
  },
  {
    to: "/entrega-borrador",
    title: "Entregar Borrador Proyecto",
    icon: DocumentArrowUpIcon,
    roles: ["estudiante"],
    permissions: ["entregarBorradorProyecto"],
  },
  {
    to: "/corregir-borrador",
    title: "Corregir Borrador Observaciones",
    icon: DocumentCheckIcon,
    roles: ["estudiante"],
    permissions: ["corregirBorradorObservaciones"],
  },
  {
    to: "/entregar-final",
    title: "Entregar Borrador Final",
    icon: DocumentDuplicateIcon,
    roles: ["estudiante"],
    permissions: ["entregarBorradorFinal"],
  },

  // Docente
  {
    to: "/aceptar-solicitudes",
    title: "Aceptar Solicitudes",
    icon: UserGroupIcon,
    roles: ["docente"],
    permissions: ["aceptarSolicitudTutoria"],
  },
  {
    to: "/gestionar-tutorias",
    title: "Gestionar Tutorías",
    icon: AcademicCapIcon,
    roles: ["docente"],
    permissions: ["guiarEstudianteProyecto"],
  },    
  {
    to: "/evaluar-perfil",
    title: "Evaluar Perfil Proyecto",
    icon: DocumentCheckIcon,
    roles: ["docente"],
    permissions: ["evaluarPerfilProyecto"],
  },
  {
    to: "/evaluar-borrador",
    title: "Evaluar Borrador Proyecto",
    icon: AcademicCapIcon,
    roles: ["docente"],
    permissions: ["proporcionarObservacionesBorrador"],
  },
  {
    to: "/evaluacion-defensa",
    title: "Evaluar Defensa",
    icon: AcademicCapIcon,
    roles: ["docente"],
    permissions: ["evaluarDefensaFinal"],
  },
  
  // Secretaría
  {
    to: "/seguimiento-tiempo-real",
    title: "Seguimiento en Tiempo Real",
    icon: ChartBarIcon,
    roles: ["secretaria"],
    permissions: ["seguimientoTiempoReal"],
  },
  {
    to: "/notificacion-observaciones",
    title: "Notificar Observaciones",
    icon: EnvelopeIcon,
    roles: ["docente"],
    permissions: ["notificarObservacionesEstudiante"],
  },

  // Director
  {
    to: "/asignar-tribunal",
    title: "Asignar Tribunal",
    icon: ClipboardDocumentCheckIcon, // Representa asignaciones o aprobaciones
    roles: ["director"],
    permissions: ["asignarTribunalEvaluador"],
  },
  {
    to: "/cronograma-defensas",
    title: "Defensas",
    icon: CalendarDaysIcon, // Representa fechas o cronogramas
    roles: ["director"],
    permissions: ["asignarFechaHoraDefensa"],
  },
  {
    to: "/registrar-conclusion",
    title: "Registrar Conclusión",
    icon: PencilSquareIcon, // Representa escritura o edición
    roles: ["director"],
    permissions: ["registrarConclusionProyecto"],
  },
  {
    to: "/conclusion-proyecto",
    title: "Conclusión Proyecto",
    icon: PencilSquareIcon, // Representa escritura o edición
    roles: ["director"],
    permissions: ["registrarConclusionProyecto"],
  },
  {
    to: "/generar-reporte",
    title: "Generar Reporte",
    icon: DocumentChartBarIcon, // Representa gráficos o reportes
    roles: ["director"],
    permissions: ["generarReportes"],
  },
   {
    to: "/seguimiento-proyecto-real-tiempo",
    title: "Seguimiento Proyecto Real Tiempo",
    icon: DocumentChartBarIcon, // Representa gráficos o reportes
    roles: ["director"],
    permissions: ["generarReportes"],
  },

  // Puedes agregar más ítems si el JSON tiene más permisos para director u otros roles
];


const filteredMenuItems = computed(() => {
  const user = authStore.user;

  if (!user || !user.role || !user.permissions) return [];

  return allMenuItems.filter((item) => {
    const roleMatch = item.roles.includes(user.role);
    const permissionMatch =
      item.permissions.length === 0 ||
      item.permissions.some((perm) => user.permissions.includes(perm));

    return roleMatch && permissionMatch;
  });
});
</script>
