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
                <h2 class="text-2xl font-bold mb-6">Registro de Conclusión del Proyecto</h2>
  
                <!-- Información del Proyecto -->
                <div class="mb-8 bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Proyecto</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Título del Proyecto</p>
                      <p class="mt-1">{{ proyecto.titulo }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Estudiante</p>
                      <p class="mt-1">{{ proyecto.estudiante }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Director</p>
                      <p class="mt-1">{{ proyecto.director }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Estado Actual</p>
                      <span
                        class="px-2 py-1 text-xs font-medium rounded-full"
                        :class="estadoClase"
                      >
                        {{ proyecto.estado }}
                      </span>
                    </div>
                  </div>
                </div>
  
                <!-- Formulario de Conclusión -->
                <div v-if="mostrarFormulario" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones Finales
                    </label>
                    <textarea
                      v-model="observacionesFinales"
                      rows="4"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Ingrese las observaciones finales del proyecto..."
                    ></textarea>
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Conclusión
                    </label>
                    <input
                      type="date"
                      v-model="fechaConclusion"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      :min="fechaMinima"
                    />
                  </div>
  
                  <!-- Confirmación -->
                  <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div class="flex">
                      <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div class="ml-3">
                        <p class="text-sm text-yellow-700">
                          Al confirmar la conclusión del proyecto, este será marcado como finalizado y no podrá ser modificado posteriormente.
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Botones de Acción -->
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="cancelarConclusion"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      @click="confirmarConclusion"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      :disabled="!formularioValido || enviando"
                    >
                      {{ enviando ? 'Guardando...' : 'Confirmar Conclusión' }}
                    </button>
                  </div>
                </div>
  
                <!-- Estado de Éxito -->
                <div v-if="proyectoConcluido" class="text-center py-8">
                  <svg
                    class="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 class="mt-2 text-lg font-medium text-gray-900">Proyecto Concluido</h3>
                  <p class="mt-1 text-sm text-gray-500">
                    El proyecto ha sido registrado como concluido exitosamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const observacionesFinales = ref('');
  const fechaConclusion = ref('');
  const enviando = ref(false);
  const proyectoConcluido = ref(false);
  const mostrarFormulario = ref(true);
  
  // Datos de ejemplo del proyecto
  const proyecto = ref({
    id: 1,
    titulo: 'Sistema de Gestión Académica',
    estudiante: 'Ana García',
    director: 'Dr. Juan Pérez',
    estado: 'En Defensa',
    fechaInicio: '2023-09-01'
  });
  
  const fechaMinima = computed(() => {
    return proyecto.value.fechaInicio;
  });
  
  const estadoClase = computed(() => {
    const estados = {
      'En Defensa': 'bg-blue-100 text-blue-800',
      'Concluido': 'bg-green-100 text-green-800',
      'En Proceso': 'bg-yellow-100 text-yellow-800'
    };
    return estados[proyecto.value.estado] || 'bg-gray-100 text-gray-800';
  });
  
  const formularioValido = computed(() => {
    return observacionesFinales.value.trim() !== '' && 
           fechaConclusion.value !== '';
  });
  
  const confirmarConclusion = async () => {
    if (!formularioValido.value) return;
  
    try {
      enviando.value = true;
      
      // Preparar datos
      const datosConclusion = {
        proyectoId: proyecto.value.id,
        observaciones: observacionesFinales.value,
        fechaConclusion: fechaConclusion.value
      };
  
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Actualizar estado
      proyecto.value.estado = 'Concluido';
      mostrarFormulario.value = false;
      proyectoConcluido.value = true;
  
      // Enviar notificación al estudiante
      await enviarNotificacionEstudiante();
  
    } catch (error) {
      console.error('Error al registrar la conclusión:', error);
      alert('Error al registrar la conclusión del proyecto');
    } finally {
      enviando.value = false;
    }
  };
  
  const enviarNotificacionEstudiante = async () => {
    try {
      // Simular envío de notificación
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Notificación enviada al estudiante');
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  };
  
  const cancelarConclusion = () => {
    if (confirm('¿Está seguro de que desea cancelar el registro de conclusión?')) {
      observacionesFinales.value = '';
      fechaConclusion.value = '';
    }
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>