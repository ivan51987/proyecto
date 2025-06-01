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
                <h2 class="text-2xl font-bold mb-6">Observaciones del Borrador</h2>
  
                <!-- Vista del Tribunal -->
                <div v-if="esTribunal" class="space-y-6">
                  <!-- Lista de Borradores -->
                  <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Borradores Disponibles</h3>
                    <div class="space-y-4">
                      <div v-for="borrador in borradores" :key="borrador.id" class="border rounded-lg p-4">
                        <div class="flex items-start justify-between">
                          <div>
                            <h4 class="text-lg font-medium text-gray-900">{{ borrador.titulo }}</h4>
                            <p class="text-sm text-gray-500">Estudiante: {{ borrador.estudiante }}</p>
                            <p class="text-sm text-gray-500">Fecha: {{ formatearFecha(borrador.fecha) }}</p>
                          </div>
                          <button
                            @click="verBorrador(borrador)"
                            class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Formulario de Observaciones -->
                  <div v-if="borradorSeleccionado" class="border-t pt-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Agregar Observaciones</h3>
                    <form @submit.prevent="enviarObservaciones" class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                          Observaciones
                        </label>
                        <textarea
                          v-model="nuevaObservacion"
                          rows="4"
                          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="Escriba sus observaciones aquí..."
                          required
                        ></textarea>
                      </div>
                      <div class="flex justify-end">
                        <button
                          type="submit"
                          class="px-4 py-2 text-white bg-primary-600 rounded-md hover:bg-primary-700"
                          :disabled="enviando"
                        >
                          {{ enviando ? 'Enviando...' : 'Enviar Observaciones' }}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
  
                <!-- Vista del Estudiante -->
                <div v-else class="space-y-6">
                  <!-- Historial de Observaciones -->
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Historial de Observaciones</h3>
                    <div class="space-y-4">
                      <div v-for="observacion in observaciones" :key="observacion.id" class="bg-gray-50 rounded-lg p-4">
                        <div class="flex items-start justify-between">
                          <div>
                            <p class="text-sm text-gray-500">{{ formatearFecha(observacion.fecha) }}</p>
                            <p class="mt-2">{{ observacion.contenido }}</p>
                          </div>
                          <div class="flex flex-col items-end">
                            <span
                              :class="[
                                'px-2 py-1 text-xs font-medium rounded-full mb-2',
                                observacion.leida
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              ]"
                            >
                              {{ observacion.leida ? 'Leída' : 'Nueva' }}
                            </span>
                            <button
                              v-if="!observacion.respondida"
                              @click="responderObservacion(observacion)"
                              class="text-sm text-primary-600 hover:text-primary-700"
                            >
                              Responder
                            </button>
                          </div>
                        </div>
  
                        <!-- Respuesta a la observación -->
                        <div v-if="observacion.respuesta" class="mt-4 pl-4 border-l-2 border-gray-200">
                          <p class="text-sm text-gray-500">Respuesta:</p>
                          <p class="mt-1">{{ observacion.respuesta }}</p>
                        </div>
                      </div>
                    </div>
  
                    <!-- Estado sin observaciones -->
                    <div v-if="observaciones.length === 0" class="text-center py-8">
                      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 class="mt-2 text-sm font-medium text-gray-900">No hay observaciones</h3>
                      <p class="mt-1 text-sm text-gray-500">
                        Aún no se han registrado observaciones para tu borrador.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal de Respuesta -->
      <div v-if="mostrarModalRespuesta" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-lg w-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Responder a la Observación
            </h3>
            <button
              @click="cerrarModalRespuesta"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="enviarRespuesta" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tu Respuesta
              </label>
              <textarea
                v-model="respuesta"
                rows="4"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="Escribe tu respuesta aquí..."
                required
              ></textarea>
            </div>
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="cerrarModalRespuesta"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                :disabled="enviandoRespuesta"
              >
                {{ enviandoRespuesta ? 'Enviando...' : 'Enviar Respuesta' }}
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Notificación -->
      <div
        v-if="mostrarNotificacion"
        class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg"
        role="alert"
      >
        <div class="flex">
          <div class="py-1">
            <svg class="h-6 w-6 text-green-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="font-bold">Éxito</p>
            <p class="text-sm">{{ mensajeNotificacion }}</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const esTribunal = ref(true); // Cambiar según el rol del usuario
  const borradores = ref([]);
  const observaciones = ref([]);
  const borradorSeleccionado = ref(null);
  const nuevaObservacion = ref('');
  const enviando = ref(false);
  const mostrarNotificacion = ref(false);
  const mensajeNotificacion = ref('');
  const mostrarModalRespuesta = ref(false);
  const observacionSeleccionada = ref(null);
  const respuesta = ref('');
  const enviandoRespuesta = ref(false);
  
  // Datos de ejemplo
  borradores.value = [
    {
      id: 1,
      titulo: 'Sistema de Gestión Académica',
      estudiante: 'Ana García',
      fecha: new Date('2024-01-15'),
      estado: 'pendiente'
    },
    {
      id: 2,
      titulo: 'Aplicación de IoT para Agricultura',
      estudiante: 'Carlos Rodríguez',
      fecha: new Date('2024-01-14'),
      estado: 'revisado'
    }
  ];
  
  observaciones.value = [
    {
      id: 1,
      fecha: new Date('2024-01-15'),
      contenido: 'Se requiere mayor detalle en la metodología propuesta.',
      leida: false,
      respondida: false,
      respuesta: null
    },
    {
      id: 2,
      fecha: new Date('2024-01-14'),
      contenido: 'Los objetivos específicos deben ser más medibles.',
      leida: true,
      respondida: true,
      respuesta: 'Se han ajustado los objetivos para hacerlos más medibles y específicos.'
    }
  ];
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const verBorrador = (borrador) => {
    borradorSeleccionado.value = borrador;
  };
  
  const enviarObservaciones = async () => {
    if (!nuevaObservacion.value.trim()) return;
  
    try {
      enviando.value = true;
      
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Agregar la nueva observación al listado
      observaciones.value.unshift({
        id: Date.now(),
        fecha: new Date(),
        contenido: nuevaObservacion.value,
        leida: false,
        respondida: false,
        respuesta: null
      });
  
      nuevaObservacion.value = '';
      mensajeNotificacion.value = 'Observaciones enviadas correctamente';
      mostrarNotificacion.value = true;
  
      setTimeout(() => {
        mostrarNotificacion.value = false;
      }, 3000);
    } catch (error) {
      console.error('Error al enviar observaciones:', error);
    } finally {
      enviando.value = false;
    }
  };
  
  const responderObservacion = (observacion) => {
    observacionSeleccionada.value = observacion;
    mostrarModalRespuesta.value = true;
  };
  
  const enviarRespuesta = async () => {
    if (!respuesta.value.trim()) return;
  
    try {
      enviandoRespuesta.value = true;
      
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Actualizar la observación con la respuesta
      const observacion = observacionSeleccionada.value;
      observacion.respuesta = respuesta.value;
      observacion.respondida = true;
  
      cerrarModalRespuesta();
      mensajeNotificacion.value = 'Respuesta enviada correctamente';
      mostrarNotificacion.value = true;
  
      setTimeout(() => {
        mostrarNotificacion.value = false;
      }, 3000);
    } catch (error) {
      console.error('Error al enviar respuesta:', error);
    } finally {
      enviandoRespuesta.value = false;
    }
  };
  
  const cerrarModalRespuesta = () => {
    mostrarModalRespuesta.value = false;
    observacionSeleccionada.value = null;
    respuesta.value = '';
  };
  
  const obtenerBorradores = async () => {
    try {
      // Aquí iría la lógica para obtener borradores del backend
      // Por ahora usamos los datos de ejemplo
    } catch (error) {
      console.error('Error al obtener borradores:', error);
    }
  };
  
  const obtenerObservaciones = async () => {
    try {
      // Aquí iría la lógica para obtener observaciones del backend
      // Por ahora usamos los datos de ejemplo
    } catch (error) {
      console.error('Error al obtener observaciones:', error);
    }
  };
  
  onMounted(() => {
    obtenerBorradores();
    obtenerObservaciones();
  });
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>