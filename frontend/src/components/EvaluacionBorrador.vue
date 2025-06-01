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
                <h2 class="text-2xl font-bold mb-6">Evaluación de Borradores</h2>
  
                <!-- Lista de Borradores -->
                <div class="space-y-6">
                  <!-- Filtros -->
                  <div class="flex space-x-4 mb-6">
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
                        <option value="revisado">Revisados</option>
                        <option value="observado">Con Observaciones</option>
                      </select>
                    </div>
                  </div>
  
                  <!-- Tarjetas de Borradores -->
                  <div class="grid gap-6 md:grid-cols-2">
                    <div v-for="borrador in borradoresFiltrados" :key="borrador.id" 
                         class="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div class="p-4">
                        <div class="flex justify-between items-start">
                          <div>
                            <h3 class="text-lg font-medium text-gray-900">{{ borrador.titulo }}</h3>
                            <p class="text-sm text-gray-500">{{ borrador.estudiante }}</p>
                            <p class="text-sm text-gray-500">Enviado: {{ formatearFecha(borrador.fechaEnvio) }}</p>
                          </div>
                          <span
                            :class="[
                              'px-2 py-1 text-xs font-medium rounded-full',
                              {
                                'bg-yellow-100 text-yellow-800': borrador.estado === 'pendiente',
                                'bg-green-100 text-green-800': borrador.estado === 'revisado',
                                'bg-red-100 text-red-800': borrador.estado === 'observado'
                              }
                            ]"
                          >
                            {{ borrador.estado.charAt(0).toUpperCase() + borrador.estado.slice(1) }}
                          </span>
                        </div>
  
                        <!-- Acciones -->
                        <div class="mt-4 flex justify-end space-x-2">
                          <button
                            @click="verDetalleBorrador(borrador)"
                            class="px-3 py-1.5 text-sm font-medium text-primary-700 bg-primary-100 rounded hover:bg-primary-200"
                          >
                            Ver Detalle
                          </button>
                          <button
                            v-if="borrador.estado === 'pendiente'"
                            @click="evaluarBorrador(borrador)"
                            class="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 rounded hover:bg-primary-700"
                          >
                            Evaluar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Estado sin borradores -->
                  <div v-if="borradoresFiltrados.length === 0" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No hay borradores pendientes</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      No hay borradores que requieran evaluación en este momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal de Detalle -->
      <div v-if="mostrarDetalle" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              Detalle del Borrador
            </h3>
            <button
              @click="cerrarDetalle"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <div v-if="borradorSeleccionado" class="space-y-6">
            <!-- Información del Borrador -->
            <div>
              <h4 class="text-xl font-bold text-gray-900">{{ borradorSeleccionado.titulo }}</h4>
              <p class="mt-2 text-gray-600">{{ borradorSeleccionado.descripcion }}</p>
            </div>
  
            <!-- Documento -->
            <div class="border rounded-lg p-4">
              <h5 class="font-medium text-gray-900 mb-4">Documento del Borrador</h5>
              <iframe
                v-if="borradorSeleccionado.documento"
                :src="borradorSeleccionado.documento"
                class="w-full h-[600px] border-0"
              ></iframe>
            </div>
  
            <!-- Historial de Observaciones -->
            <div v-if="borradorSeleccionado.observaciones?.length">
              <h5 class="font-medium text-gray-900 mb-4">Historial de Observaciones</h5>
              <div class="space-y-4">
                <div v-for="(obs, index) in borradorSeleccionado.observaciones" :key="index"
                     class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm text-gray-500">{{ formatearFecha(obs.fecha) }}</p>
                  <p class="mt-2">{{ obs.contenido }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal de Evaluación -->
      <div v-if="mostrarEvaluacion" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-lg w-full">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-medium text-gray-900">
              Evaluar Borrador
            </h3>
            <button
              @click="cerrarEvaluacion"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <form @submit.prevent="enviarEvaluacion" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                v-model="evaluacion.estado"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              >
                <option value="revisado">Aprobar</option>
                <option value="observado">Agregar Observaciones</option>
              </select>
            </div>
  
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Observaciones
              </label>
              <textarea
                v-model="evaluacion.observaciones"
                rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                :placeholder="evaluacion.estado === 'revisado' ? 'Comentarios adicionales...' : 'Detalle las observaciones...'"
                required
              ></textarea>
            </div>
  
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cerrarEvaluacion"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                :disabled="enviando"
              >
                {{ enviando ? 'Enviando...' : 'Enviar Evaluación' }}
              </button>
            </div>
          </form>
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
  const mostrarDetalle = ref(false);
  const mostrarEvaluacion = ref(false);
  const borradorSeleccionado = ref(null);
  const enviando = ref(false);
  const evaluacion = ref({
    estado: 'revisado',
    observaciones: ''
  });
  
  // Datos de ejemplo
  const borradores = ref([
    {
      id: 1,
      titulo: 'Sistema de Gestión de Inventario',
      estudiante: 'Carlos Rodríguez',
      fechaEnvio: new Date('2024-01-15'),
      descripcion: 'Implementación de un sistema de gestión de inventario utilizando tecnologías web modernas.',
      estado: 'pendiente',
      documento: '/ruta/al/documento.pdf',
      observaciones: []
    },
    {
      id: 2,
      titulo: 'Aplicación Móvil de Delivery',
      estudiante: 'Ana García',
      fechaEnvio: new Date('2024-01-14'),
      descripcion: 'Desarrollo de una aplicación móvil para gestión de entregas a domicilio.',
      estado: 'revisado',
      documento: '/ruta/al/documento.pdf',
      observaciones: [
        {
          fecha: new Date('2024-01-14'),
          contenido: 'El proyecto cumple con los requisitos establecidos. Excelente trabajo.'
        }
      ]
    }
  ]);
  
  const borradoresFiltrados = computed(() => {
    return borradores.value.filter(b => {
      const textoBusqueda = (b.titulo + b.estudiante).toLowerCase();
      const cumpleBusqueda = textoBusqueda.includes(busqueda.value.toLowerCase());
      const cumpleFiltro = !filtroEstado.value || b.estado === filtroEstado.value;
      return cumpleBusqueda && cumpleFiltro;
    });
  });
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const verDetalleBorrador = (borrador) => {
    borradorSeleccionado.value = borrador;
    mostrarDetalle.value = true;
  };
  
  const evaluarBorrador = (borrador) => {
    borradorSeleccionado.value = borrador;
    mostrarEvaluacion.value = true;
    evaluacion.value = {
      estado: 'revisado',
      observaciones: ''
    };
  };
  
  const enviarEvaluacion = async () => {
    if (!evaluacion.value.observaciones.trim()) return;
  
    try {
      enviando.value = true;
      const borrador = borradorSeleccionado.value;
      
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Actualizar estado y observaciones
      borrador.estado = evaluacion.value.estado;
      borrador.observaciones.push({
        fecha: new Date(),
        contenido: evaluacion.value.observaciones
      });
  
      cerrarEvaluacion();
    } catch (error) {
      console.error('Error al enviar evaluación:', error);
    } finally {
      enviando.value = false;
    }
  };
  
  const cerrarDetalle = () => {
    mostrarDetalle.value = false;
    borradorSeleccionado.value = null;
  };
  
  const cerrarEvaluacion = () => {
    mostrarEvaluacion.value = false;
    evaluacion.value = {
      estado: 'revisado',
      observaciones: ''
    };
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>