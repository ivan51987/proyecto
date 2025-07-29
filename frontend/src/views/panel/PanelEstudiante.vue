<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-2xl font-bold text-gray-900">
              Panel de Control de Estudiante
            </h1>
          </div>
          <div v-if="tribunalesLista.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <!-- Información general del proyecto -->
            <div class="col-span-full bg-blue-50 p-4 rounded-lg mb-4">
              <h2 class="text-xl font-bold text-gray-700">{{ tribunalesLista[0].titulo }}</h2>
              <p class="text-gray-600">Tipo de tutoría: {{ tribunalesLista[0].tipotutoria }}</p>
              <p class="text-gray-600">Estudiante: {{ tribunalesLista[0].estudiante.nombre }} ({{
                tribunalesLista[0].estudiante.email }})</p>
              <p class="text-gray-600">Carrera: {{ tribunalesLista[0].estudiante.carrera }}</p>
            </div>

            <!-- Card de cada docente -->
            <div v-for="(docente, index) in tribunalesLista[0].docentes" :key="index"
              class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center mb-4">
                <div class="p-3 rounded-full bg-green-100 bg-opacity-50">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.29.536 6.121 1.48M15 12a3 3 0 10-6 0 3 3 0 006 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h2 class="text-lg font-semibold text-gray-800">Tribunal {{ index + 1 }}</h2>
                  <p class="text-sm text-gray-600">{{ docente.nombre }}</p>
                  <span class="inline-block mt-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
                    {{ docente.email }}
                  </span>
                </div>
              </div>
              
              <!-- Botones por cada docente -->
              <div class="flex flex-col gap-2">
                <button @click="irAObservacionPerfil(docente.id, tribunalesLista[0].proyecto_id)" class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded">
                  Mostrar observación del perfil
                </button>
                <button class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-1 px-3 rounded">
                  Mostrar observación del borrador
                </button>
                <button v-if="tribunalesLista[0].estado_borrador === 'aprobado_borrador'"
                  class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded">
                  Ver fecha de defensa
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../../components/Navbar.vue'
import Sidebar from '../../components/Sidebar.vue'
import datosEstudianteServicio from "../../services/estudianteService";

const router = useRouter()
const tribunalesLista = ref([])
const estadoProyecto = ref('En revisión')

// Estado para el sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const cargarTribunalesProyecto = async () => {
  try {
    const response = await datosEstudianteServicio.tribunalesProyecto();
    tribunalesLista.value = response;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};

const irAObservacionPerfil =(id_docente, id_proyecto)=>{
  const revisado_en= 'perfil';
  router.push({
    name: 'ObservacionesPerfilTribunal',
    params: { id_proyecto, id_docente, revisado_en }
  })
}
const estadoClase = computed(() => {
  switch (estadoProyecto.value) {
    case 'Aprobado':
      return 'bg-green-100 text-green-800'
    case 'Rechazado':
      return 'bg-red-100 text-red-800'
    case 'En revisión':
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
})

onMounted(() => {
  cargarTribunalesProyecto();
});
</script>
