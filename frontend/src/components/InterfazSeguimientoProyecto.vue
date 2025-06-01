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
              <h2 class="text-2xl font-bold mb-6">Seguimiento del Proyecto</h2>
  
              <!-- Formulario de Solicitud de Orientación -->
              <div class="mb-8">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Solicitar Orientación</h3>
                <form @submit.prevent="solicitarOrientacion" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Consulta o Duda
                    </label>
                    <textarea
                      v-model="nuevaConsulta"
                      rows="4"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Describa su consulta o duda sobre el proyecto..."
                      required
                    ></textarea>
                  </div>
                  <div class="flex justify-end">
                    <button
                      type="submit"
                      :disabled="enviando"
                      class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {{ enviando ? 'Enviando...' : 'Enviar Consulta' }}
                    </button>
                  </div>
                </form>
              </div>
  
              <!-- Lista de Consultas y Respuestas -->
              <div>
                <h3 class="text-lg font-medium text-gray-900 mb-4">Historial de Consultas</h3>
                <div class="space-y-4">
                  <div v-for="(consulta, index) in consultas" :key="index" class="bg-gray-50 p-4 rounded-lg">
                    <div class="mb-4">
                      <div class="flex items-center justify-between">
                        <h4 class="text-sm font-medium text-gray-900">Consulta</h4>
                        <span class="text-xs text-gray-500">{{ consulta.fecha }}</span>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">{{ consulta.pregunta }}</p>
                    </div>
                    
                    <div v-if="consulta.respuesta" class="mt-4 pl-4 border-l-2 border-primary-200">
                      <div class="flex items-center justify-between">
                        <h4 class="text-sm font-medium text-primary-900">Respuesta del Tutor</h4>
                        <span class="text-xs text-gray-500">{{ consulta.fechaRespuesta }}</span>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">{{ consulta.respuesta }}</p>
                    </div>
                    <div v-else class="mt-2 text-sm text-gray-500 italic">
                      Esperando respuesta del tutor...
                    </div>
                  </div>
                </div>
  
                <!-- Estado sin consultas -->
                <div v-if="consultas.length === 0" class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">
                    No hay consultas registradas aún
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Notificación de Éxito -->
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
            <p class="font-bold">Consulta Enviada</p>
            <p class="text-sm">Su consulta ha sido registrada exitosamente.</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const nuevaConsulta = ref('');
  const enviando = ref(false);
  const mostrarNotificacion = ref(false);
  
  // Datos de ejemplo para las consultas
  const consultas = ref([
    {
      pregunta: '¿Cómo puedo mejorar la metodología de mi proyecto?',
      fecha: '2024-01-15 10:30',
      respuesta: 'Te sugiero revisar metodologías ágiles como Scrum o Kanban que podrían adaptarse bien a tu proyecto.',
      fechaRespuesta: '2024-01-15 14:20'
    },
    {
      pregunta: '¿Es necesario incluir un análisis de riesgos en el proyecto?',
      fecha: '2024-01-14 15:45',
      respuesta: null,
      fechaRespuesta: null
    }
  ]);
  
  const solicitarOrientacion = async () => {
    if (!nuevaConsulta.value.trim()) return;
  
    try {
      enviando.value = true;
      
      // Aquí iría la lógica de envío al backend
      const nuevaEntrada = {
        pregunta: nuevaConsulta.value,
        fecha: new Date().toLocaleString(),
        respuesta: null,
        fechaRespuesta: null
      };
      
      consultas.value.unshift(nuevaEntrada);
      nuevaConsulta.value = '';
      mostrarNotificacion.value = true;
      
      setTimeout(() => {
        mostrarNotificacion.value = false;
      }, 3000);
    } catch (error) {
      console.error('Error al enviar la consulta:', error);
    } finally {
      enviando.value = false;
    }
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>