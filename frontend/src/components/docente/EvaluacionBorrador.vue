<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main -->
    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">
                Evaluación de los Borradores de los Proyecto
              </h2>

              <!-- Filtros -->
              <div class="mb-6">
                <div class="flex space-x-4">
                  <div class="flex-1">
                    <input type="text" v-model="busqueda" placeholder="Buscar por título o estudiante..."
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                  </div>
                  <div>
                    <select v-model="filtroEstado"
                      class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option value="">Todos los estados</option>
                      <option value="en_progreso">En Progreso</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="aprobado">Aprobados</option>
                      <option value="observado">Con Observaciones</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Lista de borradores -->
              <div class="space-y-6">
                <div v-if="borradoresFiltrados.length === 0" class="text-center text-gray-500 py-10">
                  No se encontraron borradores para mostrar.
                </div>
                <div v-else v-for="borrador in borradoresPagina" :key="borrador.id" class="border rounded-lg p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ borrador.titulo }}
                      </h3>
                      <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm font-medium text-gray-500">
                            Estudiante
                          </p>
                          <p class="mt-1">{{ borrador.estudiante.nombre_estudiante }}</p>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">
                            Fecha de Inicio
                          </p>
                          <p class="mt-1">{{ formatearFecha(borrador.fecha_inicio) }}</p>
                        </div>
                      </div>
                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">Descripción</p>
                        <p class="mt-1 text-gray-700">{{ borrador.descripcion }}</p>
                      </div>
                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">
                          Área de Investigación
                        </p>
                        <p class="mt-1">{{ borrador.area }}</p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        {
                          'bg-yellow-100 text-yellow-800': borrador.estado === 'perfil_aprobado',
                          'bg-green-100 text-green-800': borrador.estado === 'borrador_aprobado',
                          'bg-red-100 text-red-800': borrador.estado === 'borrador_observado',
                        }
                      ]">
                        {{ formatearEstado(borrador.estado) }}
                      </span>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="mt-6 flex flex-wrap gap-3 justify-end">
                    <button @click="verborrador(borrador)" 
                      class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                      Ver borrador
                    </button>
                    <button @click="evaluarborrador(borrador, 'observado')" v-if="borrador.estado === 'perfil_aprobado' || borrador.estado === 'borrador_observado'"
                      class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                      Agregar Observaciones
                    </button>
                    <button @click="evaluarborrador(borrador, 'aprobado')" v-if="borrador.estado === 'perfil_aprobado' || borrador.estado === 'borrador_observado'"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                      Aprobar borrador
                    </button>
                    <button @click="verHistorial(borrador)"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                      Ver Historial
                    </button>
                  </div>
                </div>
              </div>

              <!-- Paginación -->
              <div v-if="totalPaginas > 1" class="mt-6 flex justify-center items-center space-x-4">
                <button @click="paginaAnterior" :disabled="paginaActual === 1"
                  class="px-3 py-1 rounded-md border disabled:opacity-50">
                  Anterior
                </button>

                <template v-for="num in totalPaginas" :key="num">
                  <button @click="irPagina(num)" :class="[
                    'px-3 py-1 rounded-md border',
                    paginaActual === num
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  ]">
                    {{ num }}
                  </button>
                </template>

                <button @click="paginaSiguiente" :disabled="paginaActual === totalPaginas"
                  class="px-3 py-1 rounded-md border disabled:opacity-50">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Evaluación -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-xl w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ modalTipo === 'aprobado' ? 'Aprobar borrador' : 'Agregar Observaciones' }}
        </h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ modalTipo === 'aprobado' ? 'Comentarios de Aprobación' : 'Observaciones' }}
          </label>
          <QuillEditor v-model:content="observaciones" contentType="html" theme="snow" toolbar="full"
            style="min-height: 200px" class="border border-gray-300 rounded-md bg-white" />
        </div>
        <div class="flex justify-end gap-3">
          <button @click="cerrarModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="confirmarEvaluacion" :class="[
            'px-4 py-2 text-sm font-medium text-white rounded-md',
            modalTipo === 'aprobado' ? 'bg-primary-600 hover:bg-primary-700' : 'bg-red-600 hover:bg-red-700'
          ]">
            {{ modalTipo === 'aprobado' ? 'Confirmar Aprobación' : 'Enviar Observaciones' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Historial Observaciones -->
    <div v-if="mostrarHistorial" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h3 class="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            Historial del Proyecto
          </h3>
          <button @click="cerrarHistorial" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto max-h-[70vh] pr-2">
          <ul class="space-y-6">
            <li v-for="(obs, index) in borradorHistorial.observacionesHistorial" :key="index"
              class="p-5 rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-600">
                  <strong class="text-gray-700">Fecha:</strong> {{ formatearFecha(obs.fecha) }}
                </span>
                <span :class="[
                  'text-xs font-semibold px-3 py-1 rounded-full',
                  obs.corregido ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                ]">
                  {{ obs.corregido ? 'Corregido' : 'Pendiente' }}
                </span>
              </div>
            
              <div class="space-y-1">
                <p class="text-sm text-indigo-700">
                  <strong>Tutoría:</strong> {{ obs.tipo_tutoria }}
                </p>
                <p class="text-sm text-gray-800">
                  <strong>Nombre del Tribunal:</strong> <span v-html="obs.nombre_docente"></span>
                </p> 
                <p class="text-sm text-gray-800">
                  <strong>Acción:</strong> <span v-html="obs.accion"></span>
                </p>                               
                <p class="text-sm text-gray-800">
                  <strong>Detalle de la Observación:</strong> <span v-html="obs.detalle"></span>
                </p>                
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosService from "../../services/docenteService";
const isSidebarOpen = ref(false);
const busqueda = ref('');
const filtroEstado = ref('');
const mostrarModal = ref(false);
const modalTipo = ref('');
const observaciones = ref('');
const borradorSeleccionado = ref(null);
const mostrarHistorial = ref(false);
const borradorHistorial = ref(null);

// Paginación
const paginaActual = ref(1);
const borradoresPorPagina = 2;

const borradores = ref([]);

const obtenerborradores = async () => {
  try {
    const response = await datosService.listarProyectosHistorialObservarBorrador();
    borradores.value = response;
  } catch (error) {
    console.error('Error al cargar los borradores:', error);
  }
};

const borradoresFiltrados = computed(() => {
  return borradores.value.filter(p => {
    const textoBusqueda = (p.titulo + p.estudiante.nombre_estudiante).toLowerCase();
    const cumpleBusqueda = textoBusqueda.includes(busqueda.value.toLowerCase());
    const cumpleFiltro = !filtroEstado.value || p.estado === filtroEstado.value;
    return cumpleBusqueda && cumpleFiltro;
  });
});

const borradoresPagina = computed(() => {
  const inicio = (paginaActual.value - 1) * borradoresPorPagina;
  const fin = inicio + borradoresPorPagina;
  return borradoresFiltrados.value.slice(inicio, fin);
});

const totalPaginas = computed(() => {
  return Math.ceil(borradoresFiltrados.value.length / borradoresPorPagina);
});

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const formatearEstado = (estado) =>
({
  perfil_aprobado: 'Perfil Aprobado',
  borrador_aprobado: 'Borrador Aprobado',
  borrador_observado: 'Borrador Observado',
}[estado] || 'Borrador Aprobado');

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const evaluarborrador = (borrador, tipo) => {
  modalTipo.value = tipo;
  mostrarModal.value = true;
  borradorSeleccionado.value = borrador;
  observaciones.value = '';

};

const confirmarEvaluacion = async () => {
  try {
    if (!observaciones.value.trim()) return;
    const borrador = borradorSeleccionado.value;
    borrador.observaciones_estado = modalTipo.value === 'aprobado' ? 'borrador_aprobado' : 'borrador_observado';
    borrador.observaciones_actualizado_en = new Date().toISOString();
    borrador.observaciones_tipo_tutoria = borrador.observacioneshistorial[0].tipo_tutoria;
    borrador.observaciones_accion = modalTipo.value === 'aprobado' ? 'Aprobar borrador' : 'Observación de borrador';
    borrador.observaciones_fecha = new Date().toISOString();
    borrador.observaciones_detalle = observaciones.value;
    borrador.observaciones_corregido = modalTipo.value === 'aprobado' ? true : false;

    const response = await datosService.registrarEvaluacionBorrador(borrador);

    await obtenerborradores();
    cerrarModal();
  } catch (error) {
    console.error('Error al cargar los borradores:', error);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  modalTipo.value = '';
  observaciones.value = '';
  borradorSeleccionado.value = null;
};

const verHistorial = (borrador) => {
  borradorHistorial.value = borrador;
  mostrarHistorial.value = true;
};

const cerrarHistorial = () => {
  borradorHistorial.value = null;
  mostrarHistorial.value = false;
};

// Paginación
const irPagina = (num) => {
  if (num >= 1 && num <= totalPaginas.value) {
    paginaActual.value = num;
  }
};

const paginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--;
  }
};

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++;
  }
};

onMounted(() => {
  obtenerborradores();
});
</script>
