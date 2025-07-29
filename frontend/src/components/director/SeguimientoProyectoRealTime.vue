<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">Seguimiento de Proyectos en Tiempo Real</h2>

              <!-- Filtros -->
              <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Proyecto
                  </label>
                  <select v-model="filtros.estado"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                    <option value="">Todos los estados</option>
                    <option v-for="estado in estados" :key="estado.id" :value="estado.id">
                      {{ estado.nombre }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="space-y-6">
                <div v-for="proyecto in proyectosPaginados" :key="proyecto.id"
                  class="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <h3 class="text-lg font-medium text-gray-900">{{ proyecto.titulo }}</h3>
                        <span class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                          :class="getEstadoClase(proyecto.estado)">
                          {{ estadoATexto(proyecto.estado) }}
                        </span>
                      </div>
                      <div class="mt-2 grid grid-cols-3 gap-4">
                        <div>
                          <p class="text-sm text-gray-500">Estudiante</p>
                          <p class="font-medium">{{ proyecto.estudiante.nombre }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Tutor</p>
                          <p>{{ proyecto.tutor ? proyecto.tutor.nombre : 'Sin tutor registrado' }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Tribunal</p>
                          <p class="font-medium" v-for="docente in proyecto.docentes" :key="docente.id">
                            {{ docente.nombre }}
                          </p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Fecha de Inicio</p>
                          <p class="font-medium">{{ formatearFecha(proyecto.fecha_inicio) }}</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-500">Último Avance</p>
                          <p class="font-medium">{{ formatearFecha(proyecto.ultimo_avance) }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="proyectosFiltrados.length === 0" class="text-center py-12">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    No se encontraron proyectos que coincidan con los filtros seleccionados.
                  </p>
                </div>
              </div>

              <div v-if="totalPaginas > 1" class="flex justify-center mt-6 space-x-2">
                <button @click="paginaActual--" :disabled="paginaActual === 1"
                  class="px-3 py-1 border rounded disabled:opacity-50">
                  Anterior
                </button>

                <button v-for="n in totalPaginas" :key="n" @click="paginaActual = n"
                  :class="['px-3 py-1 border rounded', { 'bg-primary-500 text-white': paginaActual === n }]">
                  {{ n }}
                </button>

                <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
                  class="px-3 py-1 border rounded disabled:opacity-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosProyectosService from "../../services/directorService";

const isSidebarOpen = ref(false);
const proyectos = ref([]);
const filtros = ref({
  estado: ''
});

const paginaActual = ref(1);
const elementosPorPagina = 2;

watch(filtros, () => {
  paginaActual.value = 1;
}, { deep: true });

const estados = [
  { id: 'en_progreso', nombre: 'En Progreso' },
  { id: 'perfil_pendiente', nombre: 'Perfil Pendiente' },
  { id: 'perfil_observado', nombre: 'Perfil Observado' },
  { id: 'perfil_aprobado', nombre: 'Perfil Aprobado' },
  { id: 'borrador_pendiente', nombre: 'Borrador Pendiente' },
  { id: 'borrador_observado', nombre: 'Borrador Observado' },
  { id: 'borrador_aprobado', nombre: 'Borrador Aprobado' },
  { id: 'programada_defensa', nombre: 'Programada Defensa' },
  { id: 'reprogramada_defensa', nombre: 'Reprogramada Defensa' },
  { id: 'concluido', nombre: 'Concluido' },
  { id: 'aprobado', nombre: 'Aprobado' },
  { id: 'rechazado', nombre: 'Rechazado' },
  { id: 'asignar_tribunal', nombre: 'Asignar Tribunal' }
];

const estadoATexto = (estado) => {
  return estado.split('_').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
};

const listaSeguimientoProyectos = async () => {
  try {
    const response = await datosProyectosService.listarSeguimientoProyectos();
    proyectos.value = response;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};

const proyectosFiltrados = computed(() => {
  return proyectos.value.filter(proyecto => {
    const cumpleEstado = !filtros.value.estado || proyecto.estado === filtros.value.estado;
    return cumpleEstado;
  });
});

const proyectosPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * elementosPorPagina;
  return proyectosFiltrados.value.slice(inicio, inicio + elementosPorPagina);
});

const totalPaginas = computed(() => {
  return Math.ceil(proyectosFiltrados.value.length / elementosPorPagina);
});

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getEstadoClase = (estado) => {
  const clases = {
    en_progreso: 'bg-yellow-100 text-yellow-800',
    perfil_pendiente: 'bg-blue-100 text-blue-800',
    perfil_observado: 'bg-red-100 text-red-800',
    perfil_aprobado: 'bg-green-100 text-green-800',
    borrador_pendiente: 'bg-blue-100 text-blue-800',
    borrador_observado: 'bg-red-100 text-red-800',
    borrador_aprobado: 'bg-green-100 text-green-800',
    programada_defensa: 'bg-indigo-100 text-indigo-800',
    reprogramada_defensa: 'bg-indigo-200 text-indigo-800',
    concluido: 'bg-gray-200 text-gray-800',
    aprobado: 'bg-green-200 text-green-800',
    rechazado: 'bg-red-200 text-red-800',
    asignar_tribunal: 'bg-purple-100 text-purple-800'
  };
  return clases[estado] || 'bg-gray-100 text-gray-800';
};

const getAvanceClase = (tipo) => {
  const clases = {
    'Documento': 'bg-blue-100 text-blue-800',
    'Revisión': 'bg-green-100 text-green-800',
    'Corrección': 'bg-yellow-100 text-yellow-800'
  };
  return clases[tipo] || 'bg-gray-100 text-gray-800';
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  listaSeguimientoProyectos();
});
</script>
