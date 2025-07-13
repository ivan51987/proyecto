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
                Evaluación de Perfiles de Proyecto
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

              <!-- Lista de Perfiles -->
              <div class="space-y-6">
                <div v-if="perfilesFiltrados.length === 0" class="text-center text-gray-500 py-10">
                  No se encontraron perfiles para mostrar.
                </div>
                <div v-else v-for="perfil in perfilesPagina" :key="perfil.id" class="border rounded-lg p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ perfil.titulo }}
                      </h3>
                      <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm font-medium text-gray-500">
                            Estudiante
                          </p>
                          <p class="mt-1">{{ perfil.estudiante.nombre_estudiante }}</p>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">
                            Fecha de Inicio
                          </p>
                          <p class="mt-1">{{ formatearFecha(perfil.fecha_inicio) }}</p>
                        </div>
                      </div>
                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">Descripción</p>
                        <p class="mt-1 text-gray-700">{{ perfil.descripcion }}</p>
                      </div>
                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">
                          Área de Investigación
                        </p>
                        <p class="mt-1">{{ perfil.area }}</p>
                      </div>
                    </div>
                    <div class="ml-4">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        {
                          'bg-yellow-100 text-yellow-800': perfil.estado === 'en_progreso',
                          'bg-green-100 text-green-800': perfil.estado === 'aprobado',
                          'bg-red-100 text-red-800': perfil.estado === 'observado'
                        }
                      ]">
                        {{ formatearEstado(perfil.estado) }}
                      </span>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div class="mt-6 flex flex-wrap gap-3 justify-end">
                    <button @click="verPerfil(perfil)"
                      class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200">
                      Ver Perfil
                    </button>
                    <button @click="evaluarPerfil(perfil, 'observado')"
                      v-if="perfil.estado === 'perfil_pendiente' || perfil.estado === 'perfil_observado'"
                      class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                      Agregar Observaciones
                    </button>
                    <button @click="evaluarPerfil(perfil, 'aprobado')"
                      v-if="perfil.estado === 'perfil_pendiente' || perfil.estado === 'perfil_observado'"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                      Aprobar Perfil
                    </button>
                    <button @click="verHistorial(perfil.proyecto_id)"
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
          {{ modalTipo === 'aprobado' ? 'Aprobar Perfil' : 'Agregar Observaciones' }}
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
            Historial del Proyecto en el Perfil
          </h3>
          <button @click="cerrarHistorial" class="text-gray-400 hover:text-gray-600">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto max-h-[70vh] pr-2">
          <ul class="space-y-6">
            <li v-for="(obs, index) in historialProyecto" :key="index"
              class="p-5 rounded-lg border border-gray-200 bg-gray-50 shadow-sm hover:shadow-md transition">
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm text-gray-600">
                  <strong class="text-gray-700">Fecha:</strong> {{ formatearFecha(obs.fecha) }}
                </span>
                <span :class="[
                  'text-xs font-semibold px-3 py-1 rounded-full',
                  obs.corregido === true
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                ]">
                  {{ obs.corregido === true ? 'Corregido' : 'Pendiente' }}
                </span>
              </div>

              <div class="space-y-1">
                <p class="text-sm text-indigo-700">
                  <strong>Tutoría:</strong>
                  {{ obs.tipo_tutoria || 'Sin especificar' }}
                </p>

                <p class="text-sm text-gray-800">
                  <strong>Estudiante:</strong>
                  <span v-if="obs.estudiante">{{ obs.estudiante.nombre_estudiante }}</span>
                  <span v-else class="text-red-500">No registrado</span>
                </p>

                <p class="text-sm text-gray-800">
                  <strong>Docente/Tribunal:</strong>
                  <span v-if="obs.docente">{{ obs.docente.nombre_docente }}</span>
                  <span v-else class="text-red-500">No asignado</span>
                </p>

                <p class="text-sm text-gray-800">
                  <strong>Tutor:</strong>
                  <span v-if="obs.tutor">{{ obs.tutor.nombre_tutor }}</span>
                  <span v-else class="text-red-500">No asignado</span>
                </p>

                <p class="text-sm text-gray-800">
                  <strong>Acción:</strong>
                  {{ obs.accion }}
                </p>

                <p class="text-sm text-gray-800">
                  <strong>Detalle:</strong>
                  {{ obs.detalles || 'Sin detalle' }}
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
import { alertaConfirmacion, alertaError, alertaExito } from '../../utils/alertas';
const isSidebarOpen = ref(false);
const busqueda = ref('');
const filtroEstado = ref('');
const mostrarModal = ref(false);
const modalTipo = ref('');
const observaciones = ref('');
const perfilSeleccionado = ref(null);
const mostrarHistorial = ref(false);
const historialProyecto = ref([]);

// Paginación
const paginaActual = ref(1);
const perfilesPorPagina = 2;

const perfiles = ref([]);

const obtenerPerfiles = async () => {
  try {
    const response = await datosService.listarProyectosHistorialObservar();
    perfiles.value = response;
  } catch (error) {
    console.error('Error al cargar los perfiles:', error);
  }
};

const perfilesFiltrados = computed(() => {
  return perfiles.value.filter(p => {
    const textoBusqueda = (p.titulo + p.estudiante.nombre_estudiante).toLowerCase();
    const cumpleBusqueda = textoBusqueda.includes(busqueda.value.toLowerCase());
    const cumpleFiltro = !filtroEstado.value || p.estado === filtroEstado.value;
    return cumpleBusqueda && cumpleFiltro;
  });
});

const perfilesPagina = computed(() => {
  const inicio = (paginaActual.value - 1) * perfilesPorPagina;
  const fin = inicio + perfilesPorPagina;
  return perfilesFiltrados.value.slice(inicio, fin);
});

const totalPaginas = computed(() => {
  return Math.ceil(perfilesFiltrados.value.length / perfilesPorPagina);
});

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const formatearEstado = (estado) =>
({
  en_revision: 'En Revisión',
  en_progreso: 'En Progreso',
  perfil_aprobado: 'Perfil Aprobado',
  perfil_observado: 'Perfil Observado',
  perfil_pendiente: 'Perfil Pendiente',
  finalizado: 'Finalizado',
}[estado] || estado);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const evaluarPerfil = (perfil, tipo) => {
  modalTipo.value = tipo;
  mostrarModal.value = true;
  perfilSeleccionado.value = perfil;
  observaciones.value = '';
};

const confirmarEvaluacion = async () => {
  try {
    if (!observaciones.value.trim()) return;
    const perfil = perfilSeleccionado.value;
    
    perfil.observaciones_estado = modalTipo.value === 'aprobado' ? 'perfil_aprobado' : 'perfil_observado';
    perfil.observaciones_actualizado_en = new Date().toISOString();
    perfil.observaciones_tipo_tutoria = perfil.tipotutoria;
    perfil.observaciones_accion = modalTipo.value === 'aprobado' ? 'Aprobar Perfil' : 'Observación de Perfil';
    perfil.observaciones_fecha = new Date().toISOString();
    perfil.observaciones_detalle = observaciones.value;
    perfil.observaciones_corregido = modalTipo.value === 'aprobado' ? true : false;
    
    const confirmacion = await alertaConfirmacion({
      title: '¿Esta seguro de enviar la observacion?',
      text: 'Una vez guardado, no podrás editarlo.',
      confirmText: 'Sí, guardar',
      cancelText: 'Cancelar'
    })
    if (confirmacion.isConfirmed) {
      try {
        const response = await datosService.registrarEvaluacionPerfil(perfil);
        if (response.registrado) {
          alertaExito(response.message)
          obtenerPerfiles();
          cerrarModal();
        } else {
          alertaError(response.message)
        }
      } catch (error) {
        alertaError(error);
      }
    }
  } catch (error) {
    console.error('Error al cargar los perfiles:', error);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  modalTipo.value = '';
  observaciones.value = '';
  perfilSeleccionado.value = null;
};

const verHistorial = async(idProyecto) => {
  try {
    const response = await datosService.lsitaHistorialProyecto(idProyecto);
    historialProyecto.value = response;
    mostrarHistorial.value = true;
  } catch (error) {
    console.log(error);
  }
 
};

const cerrarHistorial = () => {
  historialProyecto.value = null;
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
  obtenerPerfiles();
});
</script>
