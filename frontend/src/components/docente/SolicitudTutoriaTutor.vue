<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main -->
    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Lista de Solicitudes -->
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">Solicitudes de Tutoría Pendientes</h2>

              <!-- Filtros -->
              <div class="mb-6">
                <div class="flex space-x-4">
                  <div class="flex-1">
                    <input type="text" v-model="busqueda" placeholder="Buscar por nombre de estudiante..."
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                  </div>
                  <div>
                    <select v-model="filtroEstado"
                      class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option value="">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="aceptada">Aceptadas</option>
                      <option value="rechazada">Rechazadas</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Lista de Solicitudes -->
              <div class="space-y-4">
                <div v-for="solicitud in solicitudesFiltradas" :key="solicitud.id" class="border rounded-lg p-4">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center">
                        <img :src="solicitud.estudianteImagen || '/placeholder-avatar.png'" alt="Estudiante"
                          class="h-10 w-10 rounded-full" />
                        <div class="ml-4">
                          <h3 class="text-lg font-medium text-gray-900">
                            {{ solicitud.estudiante.nombre_estudiante }}
                          </h3>
                          <p class="text-sm text-gray-500"><strong>Carrera:</strong> {{ solicitud.estudiante.carrera }}</p>
                        </div>
                      </div>

                      <div class="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm font-medium text-gray-500">Titulo del Tema</p>
                          <p class="mt-1">{{ solicitud.titulo }}</p>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">Tipo de Tutoria</p>
                          <p class="mt-1">{{ obtenerNombreTutoria(solicitud.tipo_tutoria) }}</p>
                        </div>
                      </div>

                      <div class="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm font-medium text-gray-500">Área de Investigación</p>
                          <p class="mt-1">{{ solicitud.area }}</p>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">Fecha de Solicitud</p>
                          <p class="mt-1">{{ formatearFecha(solicitud.fecha_solicitud) }}</p>
                        </div>
                      </div>

                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">Motivo de la Solicitud</p>
                        <p class="mt-1 text-gray-700">{{ solicitud.detalle }}</p>
                      </div>
                    </div>

                    <div class="ml-4">
                      <span :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        {
                          'bg-yellow-100 text-yellow-800': solicitud.estado === 'pendiente',
                          'bg-green-100 text-green-800': solicitud.estado === 'aceptada',
                          'bg-red-100 text-red-800': solicitud.estado === 'rechazada'
                        }
                      ]">
                        {{ solicitud.estado.charAt(0).toUpperCase() + solicitud.estado.slice(1) }}
                      </span>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div v-if="solicitud.estado === 'pendiente'" class="mt-4 flex justify-end space-x-3">
                    <button @click="rechazarSolicitud(solicitud)"
                      class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200">
                      Rechazar
                    </button>
                    <button @click="aceptarSolicitud(solicitud)"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                      Aceptar
                    </button>
                  </div>

                  <!-- Respuesta (si existe) -->
                  <div v-if="solicitud.respuesta" class="mt-4 bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm font-medium text-gray-500">Tu Respuesta:</p>
                    <p class="mt-1">{{ solicitud.respuesta }}</p>
                  </div>
                </div>
              </div>

              <!-- Estado sin solicitudes -->
              <div v-if="solicitudesFiltradas.length === 0" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay solicitudes pendientes</h3>
                <p class="mt-1 text-sm text-gray-500">
                  No tienes solicitudes de tutoría que requieran tu atención.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Respuesta -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ modalTipo === 'aceptar' ? 'Aceptar Solicitud' : 'Rechazar Solicitud' }}
        </h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mensaje para el estudiante
          </label>
          <textarea v-model="respuestaTexto" rows="4"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :placeholder="modalTipo === 'aceptar' ? 'Escribe un mensaje de bienvenida...' : 'Explica el motivo del rechazo...'"></textarea>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button @click="cerrarModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
            Cancelar
          </button>
          <button @click="confirmarRespuesta" :class="[
            'px-4 py-2 text-sm font-medium text-white rounded-md',
            modalTipo === 'aceptar'
              ? 'bg-primary-600 hover:bg-primary-700'
              : 'bg-red-600 hover:bg-red-700'
          ]">
            {{ modalTipo === 'aceptar' ? 'Aceptar Solicitud' : 'Rechazar Solicitud' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';

const isSidebarOpen = ref(false);
const busqueda = ref('');
const filtroEstado = ref('');
const mostrarModal = ref(false);
const modalTipo = ref('');
const respuestaTexto = ref('');
const solicitudSeleccionada = ref(null);

import datosService from "../../services/docenteService";
const tiposTutoria = [
  {
    id: 'tesis',
    nombre: 'Tesis',
    descripcion: 'Trabajo de investigación, presentada públicamente, para obtener un grado académico universitario, producto del estudio teórico de un tema original, pudiendo ajustarse a cualquier modelo o paradigma de investigación y que, realizada con rigor metodológico, debe contener, en sus conclusiones, aspectos propositivos.'
  },
  {
    id: 'proyecto_pet',
    nombre: 'Programa especial de titulación(P.E.T.)',
    descripcion: 'Es el trabajo de investigación, programación y diseño de solución a algún problema o situación, aplicando estrategias apropiadas.'
  },
  {
    id: 'proyecto_grado_dirigido',
    nombre: 'Proyecto de Grado Dirigido',
    descripcion: 'Es la ejecución y evaluación del diseño de un proyecto en diferentes instituciones fuera de la universidad respaldada por un convenio interinstitucional.'
  },
  {
    id: 'diplomado',
    nombre: 'Proyecto de Grado por Diplomado',
    descripcion: 'Modalidad de graduación que se rige en el aprovechamiento académico obtenido por el estudiante durante su permanencia en un programa de formación a nivel de licenciatura, expresado en indicadores cuantitativos (promedios y mediana) e indicadores cualitativos (tiempo de duración de estudios, aprobación en primera instancia, no abandonos).'
  }
];

const obtenerNombreTutoria = (id) => {
  const tipo = tiposTutoria.find(t => t.id === id);
  return tipo ? tipo.nombre : 'Desconocido';
};
// Datos de ejemplo
const solicitudes = ref([]);
const cargarSolicitudTutorias = async () => {
  try {
    const response = await datosService.listarProyectosSolicitudTutoria();
    solicitudes.value = response;       
  } catch (error) {
    console.error('Error al cargar los docentes:', error);
  }
}
const solicitudesFiltradas = computed(() => {
  return solicitudes.value.filter(s => {
    const cumpleBusqueda = s.estudiante.nombre_estudiante.toLowerCase().includes(busqueda.value.toLowerCase());
    const cumpleFiltro = !filtroEstado.value || s.estado === filtroEstado.value;
    return cumpleBusqueda && cumpleFiltro;
  });
});

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const aceptarSolicitud = (solicitud) => {  
  console.log(solicitud);
  
  modalTipo.value = 'aceptar';
  mostrarModal.value = true;
  solicitudSeleccionada.value = solicitud;
  respuestaTexto.value = '';
};

const rechazarSolicitud = (solicitud) => {
  modalTipo.value = 'rechazar';
  mostrarModal.value = true;
  solicitudSeleccionada.value = solicitud;
  respuestaTexto.value = '';
};

const confirmarRespuesta = async () => {
  if (!respuestaTexto.value.trim()) return;

  try {
    const solicitud = solicitudSeleccionada.value;
    solicitud.estado = modalTipo.value === 'aceptar' ? 'aceptada' : 'rechazada';
    solicitud.respuesta = respuestaTexto.value;
    solicitud.fecha_respuesta = new Date().toISOString();
    await datosService.actualizarSolicitudTutoria(solicitud);

    cerrarModal();
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  modalTipo.value = '';
  respuestaTexto.value = '';
  solicitudSeleccionada.value = null;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted (() => {
  cargarSolicitudTutorias();
});

</script>