<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main -->
    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">Asignación de Tribunal Evaluador</h2>

              <!-- Tabla de Proyectos (Estudiantes) -->
              <div v-if="!proyectoSeleccionado" class="mb-8">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Lista de Proyectos</h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="proyecto in proyectos" :key="proyecto.proyecto_id">
                        <td class="px-6 py-4 whitespace-nowrap">{{ proyecto.estudiante?.nombre_estudiante }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ proyecto.titulo }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ proyecto.tipotutoria }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right">
                          <button @click="asignarTribunalA(proyecto)"
                            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                            Asignar Tribunal
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Lista de Docentes Disponibles -->
              <div v-if="proyectoSeleccionado" class="mb-8">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Docentes Disponibles</h3>
                  <div class="flex space-x-2">
                    <input type="text" v-model="busqueda" placeholder="Buscar docente..."
                      class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
                    <select v-model="filtroArea"
                      class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
                      <option value="">Todas las áreas</option>
                      <option v-for="area in areas" :key="area" :value="area">
                        {{ area }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="mb-4">
                  <button @click="cancelarAsignacion" class="text-sm text-gray-600 hover:underline">
                    ← Volver a la lista de proyectos
                  </button>
                </div>

                <!-- Tabla de Docentes -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nombre
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Área
                        </th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Seleccionar
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="docente in docentesFiltrados" :key="docente.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ docente.fullName }}</div>
                          <div class="text-sm text-gray-500">{{ docente.email }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {{ docente.especialidad }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" v-model="docentesSeleccionados" :value="docente.id"
                            :disabled="docentesSeleccionados.length >= 3 && !docentesSeleccionados.includes(docente.id)"
                            class="rounded text-primary-600 focus:ring-primary-500">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Mensaje de Selección -->
                <p class="mt-4 text-sm text-gray-500">
                  Seleccione 3 docentes para formar el tribunal evaluador
                </p>

                <!-- Botones de Acción -->
                <div class="flex justify-end space-x-3 mt-6">
                  <button @click="cancelarAsignacion"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                    Cancelar
                  </button>
                  <button @click="confirmarAsignacion"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    :disabled="!asignacionValida || enviando">
                    {{ enviando ? 'Asignando...' : 'Asignar Tribunal' }}
                  </button>
                </div>
              </div>

              <!-- Modal de Confirmación -->
              <div v-if="mostrarConfirmacion"
                class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">
                    Confirmar Asignación
                  </h3>
                  <p class="text-sm text-gray-500">
                    ¿Está seguro de que desea asignar estos docentes como tribunal evaluador?
                  </p>
                  <div class="mt-6 flex justify-end space-x-3">
                    <button @click="mostrarConfirmacion = false"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                      Cancelar
                    </button>
                    <button @click="guardarAsignacion"
                      class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                      Confirmar
                    </button>
                  </div>
                </div>
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
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosService from "../../services/materiasService";
import datosProyectosService from "../../services/directorService";
import { alertaExito, alertaError } from '../../utils/alertas';

const isSidebarOpen = ref(false);
const proyectoSeleccionado = ref(null);
const docentesSeleccionados = ref([]);
const busqueda = ref('');
const filtroArea = ref('');
const mostrarConfirmacion = ref(false);
const enviando = ref(false);

const proyectos = ref([]);
const docentes = ref([]);

const areas = computed(() => {
  return [...new Set(docentes.value.map(d => d.especialidad).filter(Boolean))];
});

const docentesFiltrados = computed(() => {
  return docentes.value.filter(d => {
    const cumpleBusqueda = d.fullName.toLowerCase().includes(busqueda.value.toLowerCase());
    const cumpleFiltroArea = !filtroArea.value || d.especialidad === filtroArea.value;
    return cumpleBusqueda && cumpleFiltroArea;
  });
});

const asignacionValida = computed(() => {
  return (
    proyectoSeleccionado.value &&
    docentesSeleccionados.value.length === 3
  );
});

const cargarProyectos = async () => {
  try {
    const response = await datosProyectosService.listarProyectos();
    proyectos.value = response;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};

const cargarDocentesDisponibles = async () => {
  try {
    const response = await datosService.listaDocentes();
    docentes.value = response;
  } catch (error) {
    console.error('Error al cargar los docentes:', error);
  }
};

const asignarTribunalA = async (proyecto) => {
  proyectoSeleccionado.value = {
    proyecto_id: proyecto.proyecto_id,
    estudiante_id: proyecto.estudiante_id,
    tipotutoria: proyecto.tipotutoria
  };
  docentesSeleccionados.value = [];
  busqueda.value = '';
  filtroArea.value = '';
  await cargarDocentesDisponibles();
};

const confirmarAsignacion = () => {
  if (!asignacionValida.value) return;
  mostrarConfirmacion.value = true;
};

const guardarAsignacion = async () => {
  mostrarConfirmacion.value = false;
  try {
    enviando.value = true;
    const asignacion = {
      proyectoId: proyectoSeleccionado.value.proyecto_id,
      estudianteId: proyectoSeleccionado.value.estudiante_id,
      tipotutoria: proyectoSeleccionado.value.tipotutoria,
      docentesIds: docentesSeleccionados.value
    };
    const response = await datosProyectosService.asignarTribunal(asignacion);
    if (response.registrado) {
      alertaExito(response.message);
      cargarProyectos();
      cancelarAsignacion();
    } else {
      alertaError(response.message);
    }
  } catch (error) {
    console.error('Error al guardar la asignación:', error);
  } finally {
    enviando.value = false;
    mostrarConfirmacion.value = false;
  }
};

const cancelarAsignacion = () => {
  proyectoSeleccionado.value = null;
  docentesSeleccionados.value = [];
  busqueda.value = '';
  filtroArea.value = '';
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  cargarProyectos();
});
</script>
