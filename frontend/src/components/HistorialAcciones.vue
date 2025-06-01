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
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-900">Historial de Acciones</h2>
                <div class="flex space-x-2">
                  <button
                    @click="obtenerHistorial"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Actualizar
                  </button>
                </div>
              </div>
  
              <!-- Lista de Acciones -->
              <div v-if="!isLoading && historial.length > 0" class="space-y-6">
                <div v-for="(accion, index) in historial" :key="index" class="bg-white border rounded-lg overflow-hidden">
                  <div class="p-4 flex items-start">
                    <div class="flex-shrink-0">
                      <div :class="[
                        'w-10 h-10 rounded-full flex items-center justify-center',
                        getIconBackground(accion.tipo)
                      ]">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getIconPath(accion.tipo)" />
                        </svg>
                      </div>
                    </div>
                    <div class="ml-4 flex-1">
                      <div class="flex items-center justify-between">
                        <p class="text-sm font-medium text-gray-900">{{ accion.descripcion }}</p>
                        <span class="text-sm text-gray-500">{{ formatearFecha(accion.fecha) }}</span>
                      </div>
                      <p class="mt-1 text-sm text-gray-500">{{ accion.detalles }}</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Estado de carga -->
              <div v-if="isLoading" class="flex justify-center items-center py-12">
                <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
  
              <!-- Estado vacío -->
              <div v-if="!isLoading && historial.length === 0" class="text-center py-12">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-gray-900">No hay acciones registradas</h3>
                <p class="mt-1 text-sm text-gray-500">No se encontraron acciones en el historial.</p>
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
  const isLoading = ref(false);
  const historial = ref([]);
  
  // Datos de ejemplo
  const obtenerHistorial = async () => {
    try {
      isLoading.value = true;
      // Simulación de carga de datos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      historial.value = [
        {
          tipo: 'solicitud',
          descripcion: 'Nueva solicitud de tutoría',
          detalles: 'Solicitud para la materia de Matemáticas',
          fecha: new Date(2024, 1, 15, 14, 30)
        },
        {
          tipo: 'actualizacion',
          descripcion: 'Actualización de perfil',
          detalles: 'Se actualizaron los datos de contacto',
          fecha: new Date(2024, 1, 14, 10, 15)
        },
        {
          tipo: 'completado',
          descripcion: 'Tutoría completada',
          detalles: 'Tutoría de Programación finalizada exitosamente',
          fecha: new Date(2024, 1, 13, 16, 45)
        }
      ];
    } catch (error) {
      console.error('Error al obtener historial:', error);
    } finally {
      isLoading.value = false;
    }
  };
  
  const formatearFecha = (fecha) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };
  
  const getIconBackground = (tipo) => {
    const backgrounds = {
      solicitud: 'bg-blue-500',
      actualizacion: 'bg-yellow-500',
      completado: 'bg-green-500'
    };
    return backgrounds[tipo] || 'bg-gray-500';
  };
  
  const getIconPath = (tipo) => {
    const icons = {
      solicitud: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      actualizacion: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      completado: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return icons[tipo] || '';
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  
  onMounted(() => {
    obtenerHistorial();
  });
  </script>