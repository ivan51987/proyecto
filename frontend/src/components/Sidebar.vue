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
            <li v-for="(item, index) in filteredMenuItems" :key="item.title + index">
              <!-- Menú con hijos: botón para expandir -->
              <button
                v-if="item.children && item.children.length"
                @click="toggleSubMenu(item.title)"
                class="w-full flex items-center justify-between rounded-xl font-bold text-sm py-3 px-4 focus:outline-none"
                :class="[
                  expandedMenus[item.title]
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                <div class="flex items-center">
                  <component :is="item.icon" class="h-5 w-5 mr-3" />
                  {{ item.title }}
                </div>
                <component
                  :is="ChevronRightIcon"
                  class="h-4 w-4 transform transition-transform duration-200"
                  :class="expandedMenus[item.title] ? 'rotate-90' : ''"
                />
              </button>

              <!-- Submenú desplegable -->
              <ul
                v-if="item.children && item.children.length && expandedMenus[item.title]"
                class="ml-6 mt-1 space-y-1"
              >
                <li v-for="child in item.children" :key="child.to ?? child.title">
                  <router-link
                    v-if="child.to !== undefined && child.to !== null && child.to !== ''"
                    :to="child.to"
                    class="flex items-center rounded-xl text-sm font-medium py-2 px-3"
                    :class="[
                      $route.path === child.to
                        ? 'bg-primary-50 text-primary-800'
                        : 'text-gray-600 hover:bg-gray-100',
                    ]"
                  >
                    <component :is="child.icon" class="h-4 w-4 mr-2" />
                    {{ child.title }}
                  </router-link>
                  <span v-else class="flex items-center rounded-xl text-sm font-medium py-2 px-3 text-gray-400 cursor-default">
                    <component :is="child.icon" class="h-4 w-4 mr-2" />
                    {{ child.title }}
                  </span>
                </li>
              </ul>

              <!-- Menú sin hijos y con ruta: router-link -->
              <router-link
                v-else-if="item.to !== undefined && item.to !== null && item.to !== ''"
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

              <!-- Menú sin hijos y sin ruta: texto plano -->
              <span
                v-else
                class="flex items-center rounded-xl font-bold text-sm py-3 px-4 text-gray-400 cursor-default"
              >
                <component :is="item.icon" class="h-5 w-5 mr-3" />
                {{ item.title }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/useAuthStore";

// Íconos importados desde Heroicons
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  DocumentCheckIcon,
  AcademicCapIcon,
  ClockIcon,
  CalendarIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  FlagIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  ClipboardDocumentCheckIcon,
  CalendarDaysIcon,
  DocumentChartBarIcon
} from "@heroicons/vue/24/outline";

const route = useRoute();
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});
const expandedMenus = reactive({});

function toggleSubMenu(menuKey) {
  expandedMenus[menuKey] = !expandedMenus[menuKey];
}

const authStore = useAuthStore();

const allMenuItems = [
  {
    to: "/dashboard",
    title: "Dashboard",
    icon: HomeIcon,
    roles: ["estudiante", "docente", "secretaria", "director"],
    permissions: [],
  },
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
  {
    to: "/asignar-tribunal",
    title: "Asignar Tribunal",
    icon: ClipboardDocumentCheckIcon,
    roles: ["director"],
    permissions: ["asignarTribunalEvaluador"],
  },
  {
    to: "/cronograma-defensas",
    title: "Defensas",
    icon: CalendarDaysIcon,
    roles: ["director"],
    permissions: ["asignarFechaHoraDefensa"],
  },
  {
    to: "/registrar-conclusion",
    title: "Registrar Conclusión",
    icon: PencilSquareIcon,
    roles: ["director"],
    permissions: ["registrarConclusionProyecto"],
  },
  {
    to: "/registrar-fecha-defensa",
    title: "Registrar Fecha Defensa",
    icon: PencilSquareIcon,
    roles: ["director"],
    permissions: ["registrarConclusionProyecto"],
  },
  {
    to: "/seguimiento-proyecto-real-tiempo",
    title: "Seguimiento Proyecto Real Tiempo",
    icon: DocumentChartBarIcon,
    roles: ["director"],
    permissions: ["generarReportes"],
  },
  {
    title: "Reportes",
    icon: DocumentChartBarIcon,
    roles: ["director"],
    permissions: ["generarReportes"],
    children: [
      {
        to: "/generar-reporte",
        title: "Generar Reporte",
        icon: DocumentChartBarIcon,
      },
    ],
  },
];

const filteredMenuItems = computed(() => {
  const user = authStore.user;
  if (!user || !user.role || !user.permissions) return [];

  const filtered = allMenuItems.filter((item) => {
    const roleMatch = item.roles.includes(user.role);
    const permissionMatch =
      item.permissions.length === 0 ||
      item.permissions.some((perm) => user.permissions.includes(perm));

    return roleMatch && permissionMatch;
  });

  // Depuración:
  filtered.forEach(item => {
    if ('to' in item && item.to === undefined) {
      console.warn('Item con to undefined:', item);
    }
    if (item.children) {
      item.children.forEach(child => {
        if ('to' in child && child.to === undefined) {
          console.warn('Child con to undefined:', child);
        }
      });
    }
  });

  return filtered;
});

</script>
