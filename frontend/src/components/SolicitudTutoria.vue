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
            <!-- Formulario de Solicitud -->
            <div v-if="!solicitudEnviada">
              <h2 class="text-2xl font-bold mb-6">Solicitud de Tutoría</h2>

              <!-- Selector de Tutor -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Tutor
                </label>
                <select
                  v-model="tutorSeleccionado"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                >
                  <option value="">Seleccione un tutor</option>
                  <option v-for="tutor in tutores" :key="tutor.id" :value="tutor">
                    {{ tutor.nombre }} - {{ tutor.especialidad }}
                  </option>
                </select>
              </div>

              <!-- Detalles de la Solicitud -->
              <div class="space-y-6">                           

                <!-- Tipo de Tutoría -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Tutoría
                  </label>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      v-for="tipo in tiposTutoria"
                      :key="tipo.id"
                      type="button"
                      @click="solicitud.tipoTutoria = tipo.id"
                      :class="[
                        'p-4 border rounded-lg text-left',
                        solicitud.tipoTutoria === tipo.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      ]"
                    >
                      <div class="font-medium">{{ tipo.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ tipo.descripcion }}</div>
                    </button>
                  </div>
                </div>

                <!-- Detalles de la Solicitud -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Detalles de la Solicitud
                  </label>
                  <textarea
                    v-model="solicitud.detalles"
                    rows="4"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Describe detalladamente lo que necesitas aprender o resolver..."
                    required
                  ></textarea>
                </div>

                <!-- Archivos Adjuntos -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Archivos Adjuntos (opcional)
                  </label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Subir archivos</span>
                          <input type="file" class="sr-only" multiple @change="handleFileUpload">
                        </label>
                        <p class="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p class="text-xs text-gray-500">
                        PDF, DOC, DOCX hasta 10MB
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Botón de Envío -->
                <button
                  type="submit"
                  @click.prevent="enviarSolicitud"
                  :disabled="!esFormularioValido"
                  class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isLoading ? 'Enviando...' : 'Enviar Solicitud' }}
                </button>
              </div>
            </div>

            <!-- Mensaje de Éxito -->
            <div v-else class="text-center py-12">
              <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="mt-3 text-lg font-medium text-gray-900">
                ¡Solicitud Enviada con Éxito!
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Tu solicitud ha sido enviada correctamente. El tutor revisará los detalles y te contactará pronto.
              </p>
              <div class="mt-6">
                <button
                  @click="reiniciarFormulario"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  Realizar otra solicitud
                </button>
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
const isLoading = ref(false);
const solicitudEnviada = ref(false);
const tutorSeleccionado = ref(null);

const tiposTutoria = [
  {
    id: 'tesis',
    nombre: 'Tesis',
    descripcion: 'Trabajo de investigación, presentada públicamente, para obtener un grado académico universitario, producto del estudio teórico de un tema original, pudiendo ajustarse a cualquier modelo o paradigma de investigación y que, realizada con rigor metodológico, debe contener, en sus conclusiones, aspectos propositivos.'
  },
  {
    id: 'proyecto_grado',
    nombre: 'Proyecto de Grado',
    descripcion: 'Es el trabajo de investigación, programación y diseño de solución a algún problema o situación, aplicando estrategias apropiadas.'
  },
  {
    id: 'proyecto_grado_dirigido',
    nombre: 'Proyecto de Grado Dirigido',
    descripcion: 'Es la ejecución y evaluación del diseño de un proyecto en diferentes instituciones fuera de la universidad respaldada por un convenio interinstitucional.'
  },
  {
    id: 'excelencia_academica',
    nombre: 'Excelencia Académica',
    descripcion: 'Modalidad de graduación que se rige en el aprovechamiento académico obtenido por el estudiante durante su permanencia en un programa de formación a nivel de licenciatura, expresado en indicadores cuantitativos (promedios y mediana) e indicadores cualitativos (tiempo de duración de estudios, aprobación en primera instancia, no abandonos).'
  }
];

const tutores = ref([
  {
    id: 1,
    nombre: 'Dr. Juan Pérez',
    especialidad: 'Matemáticas',
    calificacion: 4.8
  },
  {
    id: 2,
    nombre: 'Dra. María García',
    especialidad: 'Física',
    calificacion: 4.9
  }
]);

const solicitud = ref({
  tipoTutoria: '',
  detalles: '',
  archivos: []
});

const esFormularioValido = computed(() => {
  return (
    tutorSeleccionado.value &&
    solicitud.value.tipoTutoria &&
    solicitud.value.detalles.trim().length > 0
  );
});

const handleFileUpload = (event) => {
  solicitud.value.archivos = Array.from(event.target.files);
};

const enviarSolicitud = async () => {
  if (!esFormularioValido.value) return;
  
  try {
    isLoading.value = true;
    
    // Simulación de envío
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aquí iría la lógica real de envío
    const formData = new FormData();
    formData.append('tutorId', tutorSeleccionado.value.id);
    formData.append('tipoTutoria', solicitud.value.tipoTutoria);
    formData.append('detalles', solicitud.value.detalles);
    
    solicitud.value.archivos.forEach(file => {
      formData.append('archivos[]', file);
    });
    
    solicitudEnviada.value = true;
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
    // Aquí podrías mostrar un mensaje de error
  } finally {
    isLoading.value = false;
  }
};

const reiniciarFormulario = () => {
  solicitud.value = {
    tipoTutoria: '',
    detalles: '',
    archivos: []
  };
  tutorSeleccionado.value = null;
  solicitudEnviada.value = false;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>