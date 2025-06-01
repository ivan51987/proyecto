<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />
    
    <!-- Main -->
    <main
      class="pt-16 transition-all duration-300"
      :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']"
    >
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">Evaluación de Perfiles de Proyecto</h2>

              <!-- Filtros -->
              <div class="mb-6">
                <div class="flex space-x-4">
                  <div class="flex-1">
                    <input
                      type="text"
                      v-model="busqueda"
                      placeholder="Buscar por título o estudiante..."
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <select
                      v-model="filtroEstado"
                      class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="aprobado">Aprobados</option>
                      <option value="observado">Con Observaciones</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Lista de Perfiles -->
              <div class="space-y-6">
                <div v-for="perfil in perfilesFiltrados" :key="perfil.id" class="border rounded-lg p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-medium text-gray-900">{{ perfil.titulo }}</h3>
                      <div class="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm font-medium text-gray-500">Estudiante</p>
                          <p class="mt-1">{{ perfil.estudiante }}</p>
                        </div>
                        <div>
                          <p class="text-sm font-medium text-gray-500">Fecha de Envío</p>
                          <p class="mt-1">{{ formatearFecha(perfil.fechaEnvio) }}</p>
                        </div>
                      </div>
                      
                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">Descripción</p>
                        <p class="mt-1 text-gray-700">{{ perfil.descripcion }}</p>
                      </div>

                      <div class="mt-4">
                        <p class="text-sm font-medium text-gray-500">Área de Investigación</p>
                        <p class="mt-1">{{ perfil.areaInvestigacion }}</p>
                      </div>
                    </div>

                    <div class="ml-4">
                      <span
                        :class="[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          {
                            'bg-yellow-100 text-yellow-800': perfil.estado === 'pendiente',
                            'bg-green-100 text-green-800': perfil.estado === 'aprobado',
                            'bg-red-100 text-red-800': perfil.estado === 'observado'
                          }
                        ]"
                      >
                        {{ perfil.estado.charAt(0).toUpperCase() + perfil.estado.slice(1) }}
                      </span>
                    </div>
                  </div>

                  <!-- Acciones -->
                  <div v-if="perfil.estado === 'pendiente'" class="mt-6 flex justify-end space-x-3">
                    <!-- Botón para Ver Perfil -->
                    <button
                      @click="verPerfil(perfil)"
                      class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
                    >
                      <svg class="inline-block h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Ver Perfil
                    </button>
                    <button
                      @click="evaluarPerfil(perfil, 'observado')"
                      class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
                    >
                      Agregar Observaciones
                    </button>
                    <button
                      @click="evaluarPerfil(perfil, 'aprobado')"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    >
                      Aprobar Perfil
                    </button>
                  </div>

                  <!-- Observaciones -->
                  <div v-if="perfil.observaciones" class="mt-4 bg-gray-50 p-4 rounded-lg">
                    <p class="text-sm font-medium text-gray-500">Observaciones:</p>
                    <p class="mt-1">{{ perfil.observaciones }}</p>
                  </div>
                </div>
              </div>

              <!-- Estado sin perfiles -->
              <div v-if="perfilesFiltrados.length === 0" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay perfiles pendientes</h3>
                <p class="mt-1 text-sm text-gray-500">
                  No hay perfiles de proyecto que requieran evaluación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <!-- Modal de Vista Previa del Perfil -->
    <div v-if="mostrarVistaPrevia" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">
            Vista Previa del Perfil
          </h3>
          <button
            @click="cerrarVistaPrevia"
            class="text-gray-400 hover:text-gray-500"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="perfilSeleccionadoPreview" class="space-y-6">
          <!-- Información General -->
          <div>
            <h4 class="text-xl font-bold text-gray-900 mb-4">{{ perfilSeleccionadoPreview.titulo }}</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm font-medium text-gray-500">Estudiante</p>
                <p class="mt-1">{{ perfilSeleccionadoPreview.estudiante }}</p>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-500">Fecha de Envío</p>
                <p class="mt-1">{{ formatearFecha(perfilSeleccionadoPreview.fechaEnvio) }}</p>
              </div>
            </div>
          </div>

          <!-- Documento del Perfil -->
          <div class="border rounded-lg p-4">
            <h5 class="font-medium text-gray-900 mb-4">Documento del Perfil</h5>
            <div v-if="perfilSeleccionadoPreview.documento" class="h-[600px]">
              <iframe
                :src="perfilSeleccionadoPreview.documento"
                class="w-full h-full border-0"
                type="application/pdf"
              ></iframe>
            </div>
            <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
              <p class="text-gray-500">No hay documento disponible para visualizar</p>
            </div>
          </div>

          <!-- Detalles del Proyecto -->
          <div class="space-y-4">
            <div>
              <h5 class="font-medium text-gray-900 mb-2">Descripción del Proyecto</h5>
              <p class="text-gray-700">{{ perfilSeleccionadoPreview.descripcion }}</p>
            </div>
            <div>
              <h5 class="font-medium text-gray-900 mb-2">Área de Investigación</h5>
              <p class="text-gray-700">{{ perfilSeleccionadoPreview.areaInvestigacion }}</p>
            </div>
            <div>
              <h5 class="font-medium text-gray-900 mb-2">Objetivos</h5>
              <ul class="list-disc list-inside text-gray-700">
                <li v-for="(objetivo, index) in perfilSeleccionadoPreview.objetivos" :key="index">
                  {{ objetivo }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Acciones -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button
              @click="evaluarPerfil(perfilSeleccionadoPreview, 'observado')"
              class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              Agregar Observaciones
            </button>
            <button
              @click="evaluarPerfil(perfilSeleccionadoPreview, 'aprobado')"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Aprobar Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal de Evaluación -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ modalTipo === 'aprobado' ? 'Aprobar Perfil' : 'Agregar Observaciones' }}
        </h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ modalTipo === 'aprobado' ? 'Comentarios de Aprobación' : 'Observaciones' }}
          </label>
          <textarea
            v-model="observaciones"
            rows="4"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            :placeholder="modalTipo === 'aprobado' ? 'Comentarios adicionales...' : 'Detalle las observaciones que deben ser corregidas...'"
          ></textarea>
        </div>
        <div class="mt-6 flex justify-end space-x-3">
          <button
            @click="cerrarModal"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            @click="confirmarEvaluacion"
            :class="[
              'px-4 py-2 text-sm font-medium text-white rounded-md',
              modalTipo === 'aprobado'
                ? 'bg-primary-600 hover:bg-primary-700'
                : 'bg-red-600 hover:bg-red-700'
            ]"
          >
            {{ modalTipo === 'aprobado' ? 'Confirmar Aprobación' : 'Enviar Observaciones' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';

const isSidebarOpen = ref(false);
const busqueda = ref('');
const filtroEstado = ref('');
const mostrarModal = ref(false);
const modalTipo = ref('');
const observaciones = ref('');
const perfilSeleccionado = ref(null);
const mostrarVistaPrevia = ref(false);
const perfilSeleccionadoPreview = ref(null);

// Datos de ejemplo
const perfiles = ref([
  {
    id: 1,
    titulo: 'Sistema de Gestión de Aprendizaje Adaptativo',
    estudiante: 'María López',
    fechaEnvio: new Date('2024-01-15'),
    descripcion: 'Desarrollo de una plataforma de aprendizaje que utiliza IA para adaptar el contenido según el progreso del estudiante.',
    areaInvestigacion: 'Inteligencia Artificial en Educación',
    estado: 'pendiente',
    observaciones: null,
    documento: '/ruta/al/documento.pdf',
    objetivos: [
      'Implementar algoritmos de aprendizaje automático para personalización de contenido',
      'Desarrollar una interfaz adaptativa para diferentes dispositivos',
      'Evaluar la efectividad del sistema mediante métricas de aprendizaje'
    ]
  },
  {
    id: 2,
    titulo: 'Análisis de Datos en Tiempo Real para IoT',
    estudiante: 'Juan Pérez',
    fechaEnvio: new Date('2024-01-14'),
    descripcion: 'Sistema de análisis de datos en tiempo real para dispositivos IoT utilizando tecnologías de streaming.',
    areaInvestigacion: 'Internet de las Cosas',
    estado: 'aprobado',
    observaciones: 'Proyecto aprobado. Excelente propuesta de investigación.'
  }
]);

const perfilesFiltrados = computed(() => {
  return perfiles.value.filter(p => {
    const textoBusqueda = (p.titulo + p.estudiante).toLowerCase();
    const cumpleBusqueda = textoBusqueda.includes(busqueda.value.toLowerCase());
    const cumpleFiltro = !filtroEstado.value || p.estado === filtroEstado.value;
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

const evaluarPerfil = (perfil, tipo) => {
  modalTipo.value = tipo;
  mostrarModal.value = true;
  perfilSeleccionado.value = perfil;
  observaciones.value = '';
};

const confirmarEvaluacion = async () => {
  if (!observaciones.value.trim()) return;

  try {
    const perfil = perfilSeleccionado.value;
    perfil.estado = modalTipo.value;
    perfil.observaciones = observaciones.value;
    
    // Aquí iría la lógica para actualizar en el backend
    
    cerrarModal();
  } catch (error) {
    console.error('Error al procesar la evaluación:', error);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  modalTipo.value = '';
  observaciones.value = '';
  perfilSeleccionado.value = null;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const verPerfil = (perfil) => {
  perfilSeleccionadoPreview.value = perfil;
  mostrarVistaPrevia.value = true;
};

const cerrarVistaPrevia = () => {
  mostrarVistaPrevia.value = false;
  perfilSeleccionadoPreview.value = null;
};
</script>