<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main
      class="pt-16 transition-all duration-300"
      :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']"
    >
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Observaciones del Tribunal</h2>

        <div v-if="loading" class="text-gray-600">Cargando observaciones...</div>

        <div v-else-if="error" class="text-red-500">{{ error }}</div>

        <div v-else-if="observaciones.length === 0" class="text-gray-500">
          Aún no hay observaciones registradas.
        </div>

        <div v-else>
          <div
            v-for="(item, index) in observaciones"
            :key="index"
            class="bg-white p-4 rounded-md shadow-md mb-4 border"
          >
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">{{ item.accion }}</h3>
              <span
                :class="item.corregido ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ item.corregido ? 'Corregido' : 'Pendiente' }}
              </span>
            </div>
            <p class="text-gray-600 mt-2" v-html="item.detalles"></p>

            <button
              v-if="!item.corregido"
              @click="marcarComoCorregido(item.id)"
              class="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Marcar como corregido
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosEstudianteService from '../../services/estudianteService';

const route = useRoute();
const isSidebarOpen = ref(true);
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);

const observaciones = ref([]);
const loading = ref(true);
const error = ref(null);

const cargarObservaciones = async () => {
  loading.value = true;
  error.value = null;

  const { id_proyecto, id_docente, revisado_en } = route.params;

  try {
    const resultado = await datosEstudianteService.observacionTribunalProyecto(
      id_proyecto,
      id_docente,
      revisado_en
    );
    observaciones.value = resultado;
  } catch (err) {
    error.value = err.message || 'Error al cargar observaciones.';
  } finally {
    loading.value = false;
  }
};

const marcarComoCorregido = async(id_corregido) => {
    console.log(id_corregido);
    const resultado=await datosEstudianteService.corregirObservacion(id_corregido);
    cargarObservaciones();
};

onMounted(() => {
  cargarObservaciones();
});
</script>
