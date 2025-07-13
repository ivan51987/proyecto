<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main -->
    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-lg">
            <!-- Formulario de Solicitud -->
            <div v-if="!solicitudEnviada">
              <h2 class="text-2xl font-bold mb-6">Solicitud de Tutoría</h2>

              <!-- Selector de Tutor -->
              <div class="bg-white shadow-md rounded-lg p-6 mb-4">
                <h2 class="text-xl font-bold text-gray-800 mb-2">Información del Tutor</h2>

                <div class="flex items-center gap-4 mb-4">
                  <img
                    :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(tutorSeleccionado.fullName)}&background=0D8ABC&color=fff`"
                    class="w-16 h-16 rounded-full border-2 border-primary-500 object-cover" />
                  <div>
                    <h3 class="text-lg font-semibold">{{ tutorSeleccionado.fullName }}</h3>
                    <p class="text-sm text-gray-500">{{ tutorSeleccionado.especialidad }}</p>
                    <p class="text-sm text-gray-400">{{ tutorSeleccionado.grado }} – {{ tutorSeleccionado.carrera }}</p>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">Cursos Asignados</h4>
                  <ul class="list-disc list-inside text-sm text-gray-600">
                    <li v-for="curso in tutorSeleccionado.cursosAsignados" :key="curso.codigo">
                      {{ curso.nombre }} ({{ curso.codigo }})
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Detalles de la Solicitud -->
              <div class="space-y-6">

                <!-- Tipo de Tutoría -->
                <div v-if="informacionProyecto.length > 0" class="space-y-4">
                  <div v-for="(proyecto, index) in informacionProyecto" :key="index"
                    class="p-4 border rounded-lg bg-gray-50">
                    <h3 class="text-lg font-bold text-gray-800 mb-2">
                      Proyecto Registrado {{ informacionProyecto.length > 1 ? `#${index + 1}` : '' }}
                    </h3>
                    <p><strong>Título:</strong> {{ proyecto.titulo }}</p>
                    <p><strong>Descripción:</strong> {{ proyecto.descripcion }}</p>
                    <p><strong>Área:</strong> {{ proyecto.area }}</p>
                    <p><strong>Fecha de inicio:</strong> {{ new Date(proyecto.fecha_inicio).toLocaleDateString() }}</p>
                    <p><strong>Tipo de Tutoría:</strong> {{ proyecto.tipotutoria }}</p>
                  </div>
                </div>

                <div v-else class="text-gray-500 italic">
                  No hay proyectos disponibles para este estudiante.
                </div>

                <input type="hidden" name="tipotutoria" v-model="solicitud.tipotutoria" />
                <!-- Detalles de la Solicitud -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Detalles de la Solicitud
                  </label>
                  <textarea v-model="solicitud.detalles" rows="4"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Describe detalladamente lo que necesitas aprender o resolver..." required></textarea>
                </div>

                <!-- Archivos Adjuntos -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Archivos Adjuntos (opcional)
                  </label>
                  <div
                    class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none"
                        viewBox="0 0 48 48">
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label
                          class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Subir archivos</span>
                          <input type="file" class="sr-only" @change="handleFileUpload">
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
                <button type="submit" @click.prevent="enviarSolicitud" :disabled="!esFormularioValido"
                  class="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
                <button @click="reiniciarFormulario"
                  class="text-sm font-medium text-primary-600 hover:text-primary-500">
                  Volver
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
import { ref, computed, onMounted } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import { useRoute } from 'vue-router';
import { useTutorStore } from '../stores/tutorStore';
import { useAuthStore } from "../stores/useAuthStore";
import datosServicios from '../services/docenteService';
import datosProyecto from '../services/estudianteService';
import { alertaConfirmacion, alertaError, alertaExito } from '../utils/alertas';
const isSidebarOpen = ref(false);
const isLoading = ref(false);
const solicitudEnviada = ref(false);
const route = useRoute();
const { tutorSeleccionado } = useTutorStore();
const authStore = useAuthStore();
const informacionProyecto = ref([]);

const listarProyectoRegistrado = async () => {
  try {
    const response = await datosProyecto.listarProyectoRegistrado();
    informacionProyecto.value = response
    if (informacionProyecto.value.length > 0) {

      solicitud.value.tipotutoria = informacionProyecto.value[0].tipotutoria
      console.log(solicitud.value.tipotutoria);
      
    }
  } catch (error) {
    console.log(error);
  }

}

const solicitud = ref({
  tipotutoria: '',
  detalles: '',
  archivo: null
});

const esFormularioValido = computed(() => {
  return (
    solicitud.value.detalles.trim().length > 0
  );
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  solicitud.value.archivo = file;
};

const enviarSolicitud = async () => {
  if (!esFormularioValido.value) return;

  try {
    isLoading.value = true;
    await new Promise(resolve => setTimeout(resolve, 1500));

    const userName = authStore.user;
    const formData = new FormData();
    console.log(solicitud.value.tipotutoria);
    
    formData.append('tutorId', tutorSeleccionado.id);
    formData.append('tipotutoria', solicitud.value.tipotutoria);
    formData.append('detalles', solicitud.value.detalles);

    const archivo = solicitud.value.archivo;

    if (archivo) {
      formData.append('documento', archivo);
    }

    const confirmacion = await alertaConfirmacion({
      title: '¿Deseas solicitar la tutoria registro?',
      text: 'Una vez guardado, no podrás editarlo.',
      confirmText: 'Sí, guardar',
      cancelText: 'Cancelar'
    })
    if (confirmacion.isConfirmed) {
      try {
        const response = await datosServicios.registrarSolicitud(formData);
        if (response.registrado) {
          alertaExito(response.message)
          solicitudEnviada.value = true;
        } else {
          alertaError(response.message)
        }
      } catch (error) {
        alertaError(error);
      }
    }
  } catch (error) {
    console.error('Error al enviar la solicitud:', error);
  } finally {
    isLoading.value = false;
  }
};

const reiniciarFormulario = () => {
  solicitud.value = {
    tipotutoria: '',
    detalles: '',
    archivos: []
  };
  tutorSeleccionado.value = null;
  solicitudEnviada.value = false;
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
onMounted(() => {
  listarProyectoRegistrado();
});
</script>