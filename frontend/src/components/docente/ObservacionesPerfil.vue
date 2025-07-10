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
                <h2 class="text-2xl font-bold mb-6">Observaciones del Perfil</h2>
  
                <!-- Vista del Tribunal -->
                <div v-if="esTribunal" class="space-y-6">
                  <!-- Lista de Perfiles para Evaluar -->
                  <div class="mb-8">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Perfiles Disponibles</h3>
                    <div class="space-y-4">
                      <div v-for="perfil in perfiles" :key="perfil.id" class="border rounded-lg p-4">
                        <div class="flex items-start justify-between">
                          <div>
                            <h4 class="text-lg font-medium text-gray-900">{{ perfil.titulo }}</h4>
                            <p class="text-sm text-gray-500">Estudiante: {{ perfil.estudiante }}</p>
                            <p class="text-sm text-gray-500">Fecha: {{ formatearFecha(perfil.fecha) }}</p>
                          </div>
                          <button
                            @click="verPerfil(perfil)"
                            class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200"
                          >
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Formulario de Observaciones -->
                  <div v-if="perfilSeleccionado" class="border-t pt-6">
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
                          <span
                            :class="[
                              'px-2 py-1 text-xs font-medium rounded-full',
                              observacion.leida
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            ]"
                          >
                            {{ observacion.leida ? 'Leída' : 'Nueva' }}
                          </span>
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
                        Aún no se han registrado observaciones para tu perfil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
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
  import Navbar from '../Navbar.vue';
  import Sidebar from '../Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const esTribunal = ref(true); // Cambiar según el rol del usuario
  const perfiles = ref([]);
  const observaciones = ref([]);
  const perfilSeleccionado = ref(null);
  const nuevaObservacion = ref('');
  const enviando = ref(false);
  const mostrarNotificacion = ref(false);
  const mensajeNotificacion = ref('');
  
  // Datos de ejemplo
  perfiles.value = [
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
      leida: false
    },
    {
      id: 2,
      fecha: new Date('2024-01-14'),
      contenido: 'Los objetivos específicos deben ser más medibles.',
      leida: true
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
  
  const verPerfil = (perfil) => {
    perfilSeleccionado.value = perfil;
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
        leida: false
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
  
  const obtenerPerfiles = async () => {
    try {
      // Aquí iría la lógica para obtener perfiles del backend
      // Por ahora usamos los datos de ejemplo
    } catch (error) {
      console.error('Error al obtener perfiles:', error);
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
    obtenerPerfiles();
    obtenerObservaciones();
  });
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>