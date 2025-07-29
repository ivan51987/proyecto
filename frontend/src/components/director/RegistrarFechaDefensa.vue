<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="[isSidebarOpen ? 'ml-60' : 'ml-0', 'md:ml-60']">
      <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-2xl font-bold mb-6">Registrar Fecha de Defensa</h2>
            <div class="mt-10">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <input v-model="filtroBusqueda" type="text" placeholder="Buscar por estudiante, título o director..."
                  class="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none" />
              </div>

              <div class="overflow-auto border border-gray-200 rounded-lg shadow">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estudiante</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Título</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tribunales</th>
                      <th class="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in paginatedData" :key="item.id"
                      class="hover:bg-gray-50 even:bg-gray-50 transition-colors">
                      <td class="px-4 py-2 text-sm text-gray-800">{{ item.estudiante.nombre }}</td>
                      <td class="px-4 py-2 text-sm text-gray-800">{{ item.titulo }}</td>
                      <td class="px-4 py-2 text-sm text-gray-800">{{ item.fecha_inicio }}</td>
                      <td class="px-4 py-2 text-xs text-gray-700">
                        <ul class="space-y-1">
                          <li v-for="itemDocente in item.docentes" :key="itemDocente.id"
                            class="flex items-start gap-1.5">
                            <svg class="w-3 h-3 text-indigo-500 mt-1" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3" />
                            </svg>
                            <span class="font-medium">{{ itemDocente.nombre }}</span>
                          </li>
                        </ul>
                      </td>

                      <td class="px-4 py-2 text-sm">
                        <button @click="abrirModal(item)"
                          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                          Registrar Defensa
                        </button>
                      </td>
                    </tr>
                    <tr v-if="paginatedData.length === 0">
                      <td colspan="6" class="text-center px-4 py-4 text-sm text-gray-500">
                        No se encontraron resultados.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <ModalCrearDefensa v-if="showCreateModal" :proyecto="proyectoSeleccionado" :fecha="newEventDate"
                @close="showCreateModal = false" @registrar="registrarDefensa" />

              <div class="mt-4 flex justify-center flex-wrap gap-2">
                <button @click="paginaActual--" :disabled="paginaActual === 1"
                  class="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50">
                  Anterior
                </button>

                <button v-for="pagina in totalPaginas" :key="pagina" @click="paginaActual = pagina" :class="[
                  'px-3 py-1 rounded border text-sm',
                  paginaActual === pagina
                    ? 'bg-blue-500 text-white'
                    : 'bg-white hover:bg-gray-100'
                ]">
                  {{ pagina }}
                </button>

                <button @click="paginaActual++" :disabled="paginaActual === totalPaginas"
                  class="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-100 disabled:opacity-50">
                  Siguiente
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
import { ref, computed, watch, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import ModalCrearDefensa from './ModalCrearDefensa.vue';
import datosPostulante from "../../services/directorService";
import { alertaExito, alertaError, alertaConfirmacion } from '../../utils/alertas';

const showCreateModal = ref(false);
const proyectoSeleccionado = ref(null);
const newEventDate = ref(new Date().toISOString().slice(0, 10));
const isSidebarOpen = ref(false);
const filtroBusqueda = ref('');
const paginaActual = ref(1);
const porPagina = 3;
const conclusionesAnteriores = ref([]);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const abrirModal = (proyecto) => {
  proyectoSeleccionado.value = proyecto;
  showCreateModal.value = true;
};

const registrarDefensa = async (defensa) => {
  const confirmacion = await alertaConfirmacion({
    title: '¿Deseas registrar fecha defensa?',
    text: 'Una vez guardado, no podrás editarlo.',
    confirmText: 'Sí, guardar',
    cancelText: 'Cancelar'
  })
  if (confirmacion.isConfirmed) {
    try {
      const response = await datosPostulante.registrarDefensa(defensa);
      if (response.registrado) {
        showCreateModal.value = false;
        alertaExito('Defensa registrada exitosamente');
        listaPostulanteDefensa();
      } else {
        alertaError('Error al registrar la defensa');
      }
    } catch (error) {
      alertaError('Error al registrar la defensa:', error);
    }
  }
};

const listaPostulanteDefensa = async () => {
  try {
    const response = await datosPostulante.listarPostulantesDefender();
    conclusionesAnteriores.value = response;
    console.log(conclusionesAnteriores.value);

  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
}

const conclusionesFiltradas = computed(() => {
  const texto = filtroBusqueda.value.toLowerCase().trim();
  return conclusionesAnteriores.value.filter(item =>
    item.estudiante.nombre.toLowerCase().includes(texto) ||
    item.titulo.toLowerCase().includes(texto) ||
    item.director.toLowerCase().includes(texto)
  );
});

const totalPaginas = computed(() =>
  Math.max(1, Math.ceil(conclusionesFiltradas.value.length / porPagina))
);

const paginatedData = computed(() => {
  const start = (paginaActual.value - 1) * porPagina;
  return conclusionesFiltradas.value.slice(start, start + porPagina);
});

watch(filtroBusqueda, () => {
  paginaActual.value = 1;
});

onMounted(() => {
  listaPostulanteDefensa();
});

</script>
