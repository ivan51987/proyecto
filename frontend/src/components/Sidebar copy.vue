<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 bg-white shadow-lg max-h-screen w-60 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
    ]"
  >
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
              <router-link
                :to="item.to"
                class="flex items-center rounded-xl font-bold text-sm py-3 px-4"
                :class="[
                  $route.path === item.to
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
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
  // Dashboard (común a todos)
  {
    to: "/dashboard",
    title: "Dashboard",
    icon: HomeIcon,
    roles: ["estudiante", "tutor", "secretaria", "director", "tribunal"],
    permissions: [],
  },

  // Opciones para ESTUDIANTE
  {
    to: "/presentar-tema",
    title: "Presentar Tema",
    icon: DocumentTextIcon,
    roles: ["estudiante"],
    permissions: ["presentarTema"],
  },
  {
    to: "/buscar-tutor",
    title: "Buscar Tutor",
    icon: UserIcon,
    roles: ["estudiante"],
    permissions: ["buscarTutor"],
  },
  {
    to: "/perfil-proyecto",
    title: "Perfil Proyecto",
    icon: DocumentTextIcon,
    roles: ["estudiante"],
    permissions: [
      "consultarObservacionesPerfil",
      "corregirObservacionesPerfil",
    ],
  },
  {
    to: "/entrega-borrador",
    title: "Entrega Borrador",
    icon: DocumentArrowUpIcon,
    roles: ["estudiante"],
    permissions: ["elaborarBorrador", "entregarBorradorTribunales"],
  },
  {
    to: "/correccion-observaciones",
    title: "Correcciones Observaciones",
    icon: DocumentCheckIcon,
    roles: ["estudiante"],
    permissions: [
      "corregirObservacionesBorrador",
      "reentregarBorradorCorregido",
    ],
  },
  {
    to: "/historial",
    title: "Historial",
    icon: ClockIcon,
    roles: ["estudiante"],
    permissions: [
      "recibirComprobante",
      "consultarAprobacionTema",
      "recibirAprobacionTribunales",
    ],
  },

  // Opciones para TUTOR
  {
    to: "/elaborar-borrador",
    title: "Elaborar Borrador",
    icon: DocumentTextIcon,
    roles: ["tutor"],
    permissions: ["elaborarBorrador"],
  },
  {
    to: "/correccion-observaciones",
    title: "Correcciones Observaciones",
    icon: DocumentCheckIcon,
    roles: ["tutor"],
    permissions: ["corregirBorrador"],
  },
  {
    to: "/perfil-proyecto",
    title: "Perfil Proyecto",
    icon: DocumentTextIcon,
    roles: ["tutor"],
    permissions: ["reentregarPerfilCorregido"],
  },
  {
    to: "/gestionar-tutorias",
    title: "Gestionar Tutorías",
    icon: "AcademicCapIcon",
    roles: ["tutor"],
    permissions: [],
  },
  {
    to: "/solicitud-tutoria-tutor",
    title: "Solicitudes de Tutoría",
    icon: UserGroupIcon,
    roles: ["tutor"],
    permissions: [],
  },

  // Opciones para SECRETARÍA
  {
    to: "/registrar-fecha",
    title: "Registrar Fecha Inicio",
    icon: CalendarIcon,
    roles: ["secretaria"],
    permissions: ["registrarFechaInicio"],
  },
  {
    to: "/comprobantes",
    title: "Comprobantes",
    icon: DocumentDuplicateIcon,
    roles: ["secretaria"],
    permissions: ["recibirComprobante"],
  },
  {
    to: "/aprobacion-tema",
    title: "Aprobación de Temas",
    icon: DocumentDuplicateIcon,
    roles: ["secretaria"],
    permissions: ["consultarAprobacionTema"],
  },
  {
    to: "/aprobacion-tribunales",
    title: "Aprobación Tribunales",
    icon: UserGroupIcon,
    roles: ["secretaria"],
    permissions: ["recibirAprobacionTribunales"],
  },

  // Opciones para DIRECTOR
  {
    to: "/asignacion-fecha-defensa",
    title: "Asignar Fecha Defensa",
    icon: CalendarIcon,
    roles: ["director"],
    permissions: ["asignarFechaDefensa"],
  },
  {
    to: "/aprobar-borrador",
    title: "Aprobar Borrador",
    icon: DocumentCheckIcon,
    roles: ["director"],
    permissions: ["aprobarBorrador"],
  },
  {
    to: "/asignacion-tribunal",
    title: "Asignar Tribunal",
    icon: UserGroupIcon,
    roles: ["director"],
    permissions: [],
  },

  // Opciones para TRIBUNAL
  {
    to: "/observaciones-perfil",
    title: "Observaciones Perfil",
    icon: DocumentDuplicateIcon,
    roles: ["tribunal"],
    permissions: ["recibirObservacionesPerfil"],
  },
  {
    to: "/entrega-perfil-tribunales",
    title: "Entrega Perfil",
    icon: DocumentArrowUpIcon,
    roles: ["tribunal"],
    permissions: ["entregarPerfilTribunales"],
  },
  {
    to: "/evaluacion-borrador",
    title: "Evaluación Borrador",
    icon: DocumentCheckIcon,
    roles: ["tribunal"],
    permissions: ["obtenerAprobacionBorrador"],
  },
  {
    to: "/observaciones-borrador",
    title: "Observaciones Borrador",
    icon: DocumentDuplicateIcon,
    roles: ["tribunal"],
    permissions: ["recibirObservacionesBorrador"],
  },
  {
    to: "/evaluacion-defensa",
    title: "Evaluación Defensa",
    icon: AcademicCapIcon,
    roles: ["tribunal"],
    permissions: [],
  },

  // Opciones comunes
  {
    to: "/seguimiento-proyecto",
    title: "Seguimiento Proyecto",
    icon: ChartBarIcon,
    roles: ["estudiante", "tutor", "director"],
    permissions: [],
  },
  {
    to: "/conclusion-proyecto",
    title: "Conclusión Proyecto",
    icon: FlagIcon,
    roles: ["estudiante", "director"],
    permissions: [],
  },
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
