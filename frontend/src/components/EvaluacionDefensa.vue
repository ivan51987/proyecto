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
                <h2 class="text-2xl font-bold mb-6">Evaluación de Defensa Final</h2>
  
                <!-- Formulario de Evaluación -->
                <div class="space-y-6">
                  <!-- Información del Estudiante -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Información del Estudiante</h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Estudiante</p>
                        <p class="mt-1">{{ estudiante.nombre }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Proyecto</p>
                        <p class="mt-1">{{ estudiante.proyecto }}</p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Criterios de Evaluación -->
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Criterios de Evaluación</h3>
                    <div class="space-y-4">
                      <div v-for="criterio in criteriosEvaluacion" :key="criterio.id" class="border rounded-lg p-4">
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <h4 class="text-md font-medium text-gray-900">{{ criterio.nombre }}</h4>
                            <p class="text-sm text-gray-500 mt-1">{{ criterio.descripcion }}</p>
                          </div>
                          <div class="ml-4">
                            <select
                              v-model="criterio.calificacion"
                              class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="">Seleccionar</option>
                              <option v-for="valor in criterio.valores" :key="valor" :value="valor">
                                {{ valor }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <!-- Observaciones -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Observaciones Generales
                    </label>
                    <textarea
                      v-model="observacionesGenerales"
                      rows="4"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Ingrese sus observaciones sobre la defensa..."
                    ></textarea>
                  </div>
  
                  <!-- Calificación Final -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center">
                      <h3 class="text-lg font-medium text-gray-900">Calificación Final</h3>
                      <span class="text-2xl font-bold text-primary-600">{{ calificacionFinal }}</span>
                    </div>
                  </div>
  
                  <!-- Botones de Acción -->
                  <div class="flex justify-end space-x-3">
                    <button
                      @click="cancelarEvaluacion"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancelar
                    </button>
                    <button
                      @click="guardarEvaluacion"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      :disabled="!evaluacionValida || enviando"
                    >
                      {{ enviando ? 'Guardando...' : 'Guardar Evaluación' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal de Confirmación -->
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Confirmar Evaluación
          </h3>
          <p class="text-sm text-gray-500">
            ¿Está seguro de que desea guardar esta evaluación? Una vez guardada, no podrá ser modificada.
          </p>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="mostrarConfirmacion = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              @click="confirmarEvaluacion"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Confirmar
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
  const mostrarConfirmacion = ref(false);
  const enviando = ref(false);
  const observacionesGenerales = ref('');
  
  // Datos de ejemplo
  const estudiante = ref({
    id: 1,
    nombre: 'Ana García',
    proyecto: 'Sistema de Gestión Académica Inteligente'
  });
  
  const criteriosEvaluacion = ref([
    {
      id: 1,
      nombre: 'Dominio del Tema',
      descripcion: 'Nivel de conocimiento y comprensión del tema presentado',
      valores: [1, 2, 3, 4, 5],
      calificacion: ''
    },
    {
      id: 2,
      nombre: 'Claridad en la Presentación',
      descripcion: 'Capacidad para explicar y comunicar las ideas',
      valores: [1, 2, 3, 4, 5],
      calificacion: ''
    },
    {
      id: 3,
      nombre: 'Calidad del Material',
      descripcion: 'Organización y presentación del material de apoyo',
      valores: [1, 2, 3, 4, 5],
      calificacion: ''
    },
    {
      id: 4,
      nombre: 'Respuestas a Preguntas',
      descripcion: 'Capacidad para responder preguntas del tribunal',
      valores: [1, 2, 3, 4, 5],
      calificacion: ''
    }
  ]);
  
  const calificacionFinal = computed(() => {
    const calificaciones = criteriosEvaluacion.value
      .map(c => Number(c.calificacion))
      .filter(c => !isNaN(c));
  
    if (calificaciones.length === 0) return '-';
  
    const promedio = calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length;
    return promedio.toFixed(2);
  });
  
  const evaluacionValida = computed(() => {
    return criteriosEvaluacion.value.every(c => c.calificacion !== '') &&
           observacionesGenerales.value.trim() !== '';
  });
  
  const guardarEvaluacion = () => {
    if (!evaluacionValida.value) return;
    mostrarConfirmacion.value = true;
  };
  
  const confirmarEvaluacion = async () => {
    try {
      enviando.value = true;
      
      // Preparar datos de evaluación
      const evaluacion = {
        estudianteId: estudiante.value.id,
        criterios: criteriosEvaluacion.value.map(c => ({
          id: c.id,
          calificacion: c.calificacion
        })),
        observaciones: observacionesGenerales.value,
        calificacionFinal: calificacionFinal.value
      };
  
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Mostrar mensaje de éxito y redireccionar
      alert('Evaluación guardada exitosamente');
      // Aquí iría la redirección o actualización del estado
    } catch (error) {
      console.error('Error al guardar la evaluación:', error);
      alert('Error al guardar la evaluación');
    } finally {
      enviando.value = false;
      mostrarConfirmacion.value = false;
    }
  };
  
  const cancelarEvaluacion = () => {
    if (confirm('¿Está seguro de que desea cancelar la evaluación? Se perderán todos los datos ingresados.')) {
      // Reiniciar formulario
      criteriosEvaluacion.value.forEach(c => c.calificacion = '');
      observacionesGenerales.value = '';
    }
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>