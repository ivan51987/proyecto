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
            <!-- Panel de Notificaciones -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
              <div class="p-6">
                <h2 class="text-2xl font-bold mb-6">Notificaciones</h2>
  
                <!-- Lista de Notificaciones -->
                <div class="space-y-4">
                  <div v-for="notificacion in notificaciones" :key="notificacion.id"
                       class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                       :class="{'bg-blue-50': !notificacion.leida}"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center">
                          <svg
                            v-if="!notificacion.leida"
                            class="h-3 w-3 text-blue-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 8 8"
                          >
                            <circle cx="4" cy="4" r="3" />
                          </svg>
                          <h4 class="text-lg font-medium text-gray-900">
                            {{ notificacion.titulo }}
                          </h4>
                        </div>
                        <p class="mt-1 text-sm text-gray-600">
                          {{ notificacion.mensaje }}
                        </p>
                        <div class="mt-2 flex items-center text-sm text-gray-500">
                          <svg
                            class="h-4 w-4 mr-1.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {{ formatearFecha(notificacion.fecha) }}
                        </div>
                      </div>
                      <div class="ml-4 flex-shrink-0">
                        <button
                          v-if="!notificacion.leida"
                          @click="marcarComoLeida(notificacion)"
                          class="text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          Marcar como leída
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <!-- Estado sin notificaciones -->
                  <div v-if="notificaciones.length === 0" class="text-center py-12">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No hay notificaciones</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      No tienes notificaciones pendientes en este momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const notificaciones = ref([]);
  
  // Datos de ejemplo
  const cargarNotificaciones = () => {
    notificaciones.value = [
      {
        id: 1,
        titulo: 'Nuevas observaciones en tu borrador',
        mensaje: 'El tribunal ha realizado nuevas observaciones en tu borrador del proyecto.',
        fecha: new Date('2024-01-15T10:30:00'),
        leida: false,
        tipo: 'borrador'
      },
      {
        id: 2,
        titulo: 'Actualización de perfil requerida',
        mensaje: 'Se requieren ajustes en el perfil de tu proyecto según las observaciones del tribunal.',
        fecha: new Date('2024-01-14T15:45:00'),
        leida: true,
        tipo: 'perfil'
      }
    ];
  };
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const marcarComoLeida = async (notificacion) => {
    try {
      // Aquí iría la llamada al backend para actualizar el estado
      await new Promise(resolve => setTimeout(resolve, 500));
      
      notificacion.leida = true;
    } catch (error) {
      console.error('Error al marcar la notificación como leída:', error);
    }
  };
  
  const obtenerNotificaciones = async () => {
    try {
      // Aquí iría la lógica para obtener las notificaciones del backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      cargarNotificaciones();
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error);
    }
  };
  
  onMounted(() => {
    obtenerNotificaciones();
  });
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>