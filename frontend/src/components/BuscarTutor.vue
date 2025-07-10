<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main -->
    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Buscador -->
          <div class="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Buscar Tutor</h2>

            <div class="flex flex-col md:flex-row md:items-center gap-4">
              <!-- Campo de búsqueda con ícono -->
              <div class="relative w-full">
                <span class="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                  </svg>
                </span>
                <input v-model="busqueda" @input="buscarTutores" type="text"
                  placeholder="Buscar por nombre, especialidad o curso..."
                  class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition" />
              </div>

              <!-- Botón de búsqueda -->
              <button @click="buscarTutores"
                class="px-6 py-2 bg-primary-600 text-white font-semibold rounded-lg shadow-sm hover:bg-primary-700 transition focus:outline-none focus:ring-2 focus:ring-primary-500">
                Buscar
              </button>
            </div>
          </div>


          <!-- Lista de Tutores -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="tutor in tutoresFiltrados" :key="tutor.id"
              class="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200">
              <div class="p-6">
                <!-- Header: Avatar y Nombre -->
                <div class="flex items-center gap-4">
                  <img
                    :src="tutor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.fullName)}&background=0D8ABC&color=fff`"
                    :alt="tutor.fullName" class="h-16 w-16 rounded-full object-cover ring-2 ring-primary-500" />
                  <div>
                    <h3 class="text-xl font-semibold text-gray-800">{{ tutor.fullName }}</h3>
                    <p class="text-sm text-gray-500 italic">{{ tutor.especialidad }}</p>
                    <p class="text-xs text-gray-400 mt-0.5">{{ tutor.grado }} – {{ tutor.carrera }}</p>
                  </div>
                </div>

                <!-- Calificación -->
                <div class="mt-4 flex items-center">
                  <div class="flex text-yellow-400">
                    <svg v-for="i in 5" :key="i" class="h-5 w-5 transition-all"
                      :class="i <= (tutor.calificacion || 5) ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-600">{{ tutor.calificacion || 5 }} / 5</span>
                </div>

                <!-- Cursos asignados -->
                <div class="mt-5">
                  <h4 class="text-sm font-medium text-gray-800 mb-2">Cursos Asignados</h4>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="curso in tutor.cursosAsignados" :key="curso.codigo"
                      class="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {{ curso.nombre }} – {{ curso.codigo }}
                    </span>
                  </div>
                </div>

                <!-- Botón -->
                <div class="mt-6">
                  <button @click="seleccionarTutor(tutor)"
                    class="w-full py-2 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700 transition duration-200">
                    Solicitar Tutoría
                  </button>
                </div>
              </div>
            </div>


          </div>

          <!-- Estado de carga -->
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTutorStore } from '../stores/tutorStore';

import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';
import datosService from "../services/materiasService";
const router = useRouter();
const isSidebarOpen = ref(false);
const isLoading = ref(false);
const busqueda = ref('');
const filtrosActivos = ref([]);

const storeTutor = useTutorStore();
const tutores = ref([]);

const cargarDocentes = async () => {
  try {
    const response = await datosService.listaDocentes();
    tutores.value = response;
  } catch (error) {
    console.error('Error al cargar los docentes:', error);
  }
};


onMounted(() => {
  cargarDocentes().then(() => buscarTutores());
});



const tutoresFiltrados = computed(() => {
  return tutores.value.filter(tutor => {
    const termino = busqueda.value.toLowerCase();

    const coincideNombre = tutor.fullName.toLowerCase().includes(termino);
    const coincideEspecialidad = tutor.especialidad.toLowerCase().includes(termino);
    const coincideCurso = tutor.cursosAsignados.some(curso =>
      curso.nombre.toLowerCase().includes(termino) ||
      curso.codigo.toLowerCase().includes(termino)
    );

    const coincideFiltros = filtrosActivos.value.length === 0 ||
      tutor.cursosAsignados.some(curso =>
        filtrosActivos.value.includes(curso.nombre)
      );

    return (coincideNombre || coincideEspecialidad || coincideCurso) && coincideFiltros;
  });
});


const buscarTutores = async () => {
  isLoading.value = true;
  try {

    await new Promise(resolve => setTimeout(resolve, 1000));
  } finally {
    isLoading.value = false;
  }
};

const seleccionarTutor = (tutor) => {
  storeTutor.tutorSeleccionado = tutor;
  router.push('/solicitar-tutoria');
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>