<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <h2 class="text-2xl font-bold mb-6">Proyectos Asignados como Tribunal</h2>

            <!-- Filtros -->
            <div class="mb-6 flex flex-wrap gap-4">
              <select v-model="filtroEstado" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option value="">Todos los estados</option>
                <option value="en_revision">En Revisión</option>
                <option value="aprobado">Aprobado</option>
                <option value="observado">Observado</option>
                <option value="finalizado">Finalizado</option>
              </select>

              <select v-model="filtroCarrera" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option value="">Todas las carreras</option>
                <option value="sistemas">Ingeniería de Sistemas</option>
                <option value="informatica">Ingeniería Informática</option>
              </select>

              <select v-model="filtroTipo" class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                <option value="">Todos los tipos</option>
                <option value="tesis">Tesis</option>
                <option value="pet">PET</option>
                <option value="diplomado">Diplomado</option>
              </select>
            </div>

            <!-- Lista de proyectos -->
            <div class="space-y-4">
              <div
                v-for="proyecto in proyectosPaginados"
                :key="proyecto.id"
                class="border rounded-lg p-6 hover:bg-gray-50"
              >
                <div class="flex justify-between items-start">
                  <div class="space-y-2">
                    <h3 class="text-lg font-medium text-gray-900">{{ proyecto.titulo }}</h3>

                    <div class="flex flex-wrap gap-2 text-sm text-gray-500">
                      <p><span class="font-medium">Postulantes:</span> {{ proyecto.estudiante.nombre_estudiante }}</p>
                      <p><span class="font-medium">Tutor:</span> {{ proyecto.tutor.nombre_tutor }}</p>
                    </div>

                    <p class="text-sm text-gray-600">{{ proyecto.descripcion }}</p>

                    <div class="flex flex-wrap gap-4 text-sm">
                      <p><span class="font-medium">Carrera:</span> {{ proyecto.estudiante.carrera }}</p>
                      <p><span class="font-medium">Tipo:</span> {{ formatearTipo(proyecto.tipo_tutoria) }}</p>
                      <p><span class="font-medium">Fecha de inicio:</span> {{ new Date(proyecto.fecha_inicio).toLocaleDateString() }}</p>
                    </div>
                  </div>

                  <div class="flex flex-col items-end space-y-2">
                    <span :class="badgeEstadoClass(proyecto.estado)">
                      {{ formatearEstado(proyecto.estado) }}
                    </span>
                  </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex flex-wrap gap-2 mt-4 justify-end">
                  <button @click="verDetalles(proyecto)" class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    Ver Detalles
                  </button>
                  <button @click="descargarPDF(proyecto)" class="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Descargar PDF
                  </button>
                  <button @click="enviarMensaje(proyecto)" class="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700">
                    Enviar Mensaje
                  </button>
                </div>
              </div>
            </div>

            <!-- Paginación -->
            <div class="mt-6 flex justify-center items-center space-x-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Anterior
              </button>

              <span>Página {{ currentPage }} de {{ totalPages }}</span>

              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Detalles -->
    <div v-if="modalDetalle" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <h3 class="text-xl font-bold mb-4">Detalles del Proyecto</h3>
        <p><strong>Título:</strong> {{ proyectoSeleccionado?.titulo }}</p>
        <p><strong>Estudiantes:</strong> {{ proyectoSeleccionado?.estudiante.nombre_estudiante }}</p>
        <p><strong>Tutor:</strong> {{ proyectoSeleccionado?.tutor.nombre_tutor }}</p>
        <p><strong>Tipo:</strong> {{ formatearTipo(proyectoSeleccionado?.tipo_tutoria) }}</p>
        <p><strong>Carrera:</strong> {{ proyectoSeleccionado?.estudiante.carrera }}</p>
        <p><strong>Descripción:</strong> {{ proyectoSeleccionado?.descripcion }}</p>
        <p><strong>Estado:</strong> {{ formatearEstado(proyectoSeleccionado?.estado) }}</p>
        <div class="mt-4 flex justify-end">
          <button @click="cerrarModal" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosService from "../../services/docenteService";
const isSidebarOpen = ref(false);
const filtroEstado = ref('');
const filtroCarrera = ref('');
const filtroTipo = ref('');
const currentPage = ref(1);
const pageSize = ref(2);

const modalDetalle = ref(false);
const proyectoSeleccionado = ref(null);

const proyectos = ref([]);
const cargarProyectos= async () =>{
  try {
    const response = await datosService.listarProyectosAsignadosTribunal();
    proyectos.value = response;    
  } catch (error) {
    console.error('Error al cargar los docentes:', error);
  }
}

const proyectosFiltrados = computed(() =>
  proyectos.value.filter((p) => {
    if (filtroEstado.value && p.estado !== filtroEstado.value) return false;
    if (filtroCarrera.value && !p.carrera.toLowerCase().includes(filtroCarrera.value)) return false;
    if (filtroTipo.value && p.tipo !== filtroTipo.value) return false;
    return true;
  })
);

const totalPages = computed(() => Math.ceil(proyectosFiltrados.value.length / pageSize.value));

const proyectosPaginados = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return proyectosFiltrados.value.slice(start, end);
});

watch([filtroEstado, filtroCarrera, filtroTipo], () => {
  currentPage.value = 1;
});

const formatearEstado = (estado) =>
  ({
    en_revision: 'En Revisión',
    en_progreso: 'En Progreso',
    aprobado: 'Aprobado',
    observado: 'Observado',
    finalizado: 'Finalizado',
  }[estado] || estado);

const badgeEstadoClass = (estado) =>
  ({
    en_revision: 'bg-yellow-100 text-yellow-800',
    aprobado: 'bg-green-100 text-green-800',
    observado: 'bg-red-100 text-red-800',
    finalizado: 'bg-blue-100 text-blue-800',
  }[estado] + ' px-2 py-1 rounded-full text-sm font-medium');

const formatearTipo = (tipo) =>
  ({
    tesis: 'Tesis',
    pet: 'PET',
    diplomado: 'Diplomado',
  }[tipo] || tipo);

// Botones de acción
const verDetalles = (proyecto) => {
  proyectoSeleccionado.value = proyecto;
  modalDetalle.value = true;
};

const cerrarModal = () => {
  proyectoSeleccionado.value = null;
  modalDetalle.value = false;
};

const descargarPDF = (proyecto) => {
  alert(`Descargando PDF del proyecto: ${proyecto.titulo}`);
};

const enviarMensaje = (proyecto) => {
  alert(`Enviando mensaje sobre el proyecto: ${proyecto.titulo}`);
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  cargarProyectos();
});
</script>
