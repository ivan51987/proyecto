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
            <div class="bg-white p-6 rounded-lg shadow-lg">
              <h2 class="text-2xl font-bold mb-6">Observaciones del Perfil</h2>
  
              <!-- Lista de Observaciones -->
              <div v-if="observaciones.length > 0" class="space-y-6 mb-8">
                <div v-for="(observacion, index) in observaciones" :key="index" class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div class="flex items-start">
                    <div class="flex-shrink-0">
                      <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-yellow-800">
                        Observación #{{ index + 1 }}
                      </h3>
                      <div class="mt-2 text-sm text-yellow-700">
                        <p>{{ observacion.descripcion }}</p>
                      </div>
                      <div class="mt-2">
                        <textarea
                          v-model="observacion.correccion"
                          rows="3"
                          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          :placeholder="'Escriba su corrección para la observación #' + (index + 1)"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Estado sin observaciones -->
              <div v-else class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay observaciones pendientes</h3>
                <p class="mt-1 text-sm text-gray-500">
                  Su perfil no tiene observaciones que requieran corrección.
                </p>
              </div>
  
              <!-- Formulario de Correcciones -->
              <div v-if="observaciones.length > 0" class="mt-6 border-t pt-6">
                <h3 class="text-lg font-medium mb-4">Enviar Correcciones</h3>
                
                <!-- Comentarios Adicionales -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios Adicionales (opcional)
                  </label>
                  <textarea
                    v-model="comentariosAdicionales"
                    rows="4"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Agregue cualquier comentario o aclaración adicional..."
                  ></textarea>
                </div>
  
                <!-- Botones de Acción -->
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="guardarBorrador"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Guardar borrador
                  </button>
                  <button
                    type="submit"
                    @click="enviarCorrecciones"
                    :disabled="!hayCorreccionesPendientes || enviando"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {{ enviando ? 'Enviando...' : 'Enviar correcciones' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal de Confirmación -->
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Correcciones Enviadas</h3>
            <p class="mt-2 text-sm text-gray-500">
              Sus correcciones han sido enviadas exitosamente. Serán revisadas por el evaluador.
            </p>
            <div class="mt-4">
              <button
                @click="cerrarConfirmacion"
                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const enviando = ref(false);
  const mostrarConfirmacion = ref(false);
  const comentariosAdicionales = ref('');
  
  // Datos de ejemplo para las observaciones
  const observaciones = ref([
    {
      id: 1,
      descripcion: 'El objetivo general no está claramente definido. Debe ser más específico y medible.',
      correccion: ''
    },
    {
      id: 2,
      descripcion: 'La justificación del proyecto no menciona el impacto esperado en la facultad.',
      correccion: ''
    }
  ]);
  
  const hayCorreccionesPendientes = computed(() => {
    return observaciones.value.some(obs => obs.correccion.trim().length > 0);
  });
  
  const obtenerObservaciones = async () => {
    try {
      // Aquí iría la llamada al servicio para obtener las observaciones
      // Por ahora usamos datos de ejemplo
    } catch (error) {
      console.error('Error al obtener observaciones:', error);
    }
  };
  
  const guardarBorrador = async () => {
    try {
      // Aquí iría la lógica para guardar el borrador
      console.log('Guardando borrador:', {
        observaciones: observaciones.value,
        comentarios: comentariosAdicionales.value
      });
    } catch (error) {
      console.error('Error al guardar el borrador:', error);
    }
  };
  
  const enviarCorrecciones = async () => {
    if (!hayCorreccionesPendientes.value) return;
  
    try {
      enviando.value = true;
      // Aquí iría la lógica para enviar las correcciones
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      mostrarConfirmacion.value = true;
    } catch (error) {
      console.error('Error al enviar las correcciones:', error);
    } finally {
      enviando.value = false;
    }
  };
  
  const cerrarConfirmacion = () => {
    mostrarConfirmacion.value = false;
    // Opcional: redirigir o actualizar la página
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  onMounted(() => {
    obtenerObservaciones();
  });
  </script>