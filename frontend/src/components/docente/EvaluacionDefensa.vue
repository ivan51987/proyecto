<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">Evaluación de los Borradores del Proyecto</h2>

              <!-- Filtro -->
              <div class="mb-6 max-w-md">
                <input
                  type="text"
                  v-model="filtroBusqueda"
                  placeholder="Buscar por nombre del postulante o tema..."
                  class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <!-- Lista de borradores -->
              <div class="space-y-6">
                <div v-if="borradoresFiltrados.length === 0" class="text-center text-gray-500 py-10">
                  No se encontraron borradores para mostrar.
                </div>
                <div
                  v-else
                  v-for="borrador in borradoresPaginados"
                  :key="borrador.id"
                  class="border rounded-lg p-6 bg-white"
                >
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-lg font-bold">{{ borrador.titulo }}</h3>
                      <p class="text-sm text-gray-600">Estudiante: {{ borrador.estudiante.nombre_estudiante }}</p>
                    </div>
                    <div class="flex space-x-2">
                      <button
                        @click="abrirModalEvaluacion(borrador)"
                        class="px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                      >
                        Registrar Nota
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Paginación -->
              <div v-if="totalPaginas > 1" class="mt-6 flex justify-center items-center space-x-2">
                <button
                  @click="paginaAnterior"
                  :disabled="paginaActual === 1"
                  class="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Anterior
                </button>

                <button
                  v-for="num in totalPaginas"
                  :key="num"
                  @click="irPagina(num)"
                  :class="[
                    'px-3 py-1 rounded border',
                    paginaActual === num
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ num }}
                </button>

                <button
                  @click="paginaSiguiente"
                  :disabled="paginaActual === totalPaginas"
                  class="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Evaluación -->
    <div
      v-if="mostrarModalEvaluacion"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-bold">Evaluación de Defensa Final</h2>
            <button @click="cerrarModalEvaluacion" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
          </div>

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

            <!-- Criterios -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Criterios de Evaluación</h3>
              <div class="space-y-4">
                <div
                  v-for="criterio in criteriosEvaluacion"
                  :key="criterio.id"
                  class="border rounded-lg p-4"
                >
                  <div class="flex justify-between items-start">
                    <div class="flex-1">
                      <h4 class="text-md font-medium">{{ criterio.nombre }}</h4>
                      <p class="text-sm text-gray-500 mt-1">{{ criterio.descripcion }}</p>
                    </div>
                    <div class="ml-4">
                      <select
                        v-model="criterio.calificacion"
                        class="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="">Seleccionar</option>
                        <option v-for="valor in criterio.valores" :key="valor" :value="valor">{{ valor }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Observaciones -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Observaciones Generales</label>
              <textarea
                v-model="observacionesGenerales"
                rows="4"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              ></textarea>
            </div>

            <!-- Calificación Final -->
            <div class="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
              <h3 class="text-lg font-medium">Calificación Final</h3>
              <span class="text-2xl font-bold text-indigo-600">{{ calificacionFinal }}</span>
            </div>

            <!-- Botones -->
            <div class="flex justify-end space-x-3">
              <button
                @click="cerrarModalEvaluacion"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                @click="guardarEvaluacion"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosService from "../../services/docenteService";

const isSidebarOpen = ref(false);
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value);


const filtroBusqueda = ref('');

const borradores = ref([]);

const listarProyectosDefender=async()=>{
  try {
    const response = await datosService.lsitarProyectosParaEvaluarDefensa();
    borradores.value = response;
    console.log(borradores);
    
  } catch (error) {
    console.error('Error al cargar los borradores:', error);
  }
}

const borradoresFiltrados = computed(() => {
  const texto = filtroBusqueda.value.toLowerCase().trim();
  const lista = Array.isArray(borradores.value) ? borradores.value : [];

  return texto
    ? lista.filter(b =>
        b.titulo.toLowerCase().includes(texto) ||
        b.estudiante.nombre_estudiante.toLowerCase().includes(texto)
      )
    : lista;
});


const itemsPorPagina = 3;
const paginaActual = ref(1);

const totalPaginas = computed(() => {
  return Math.ceil(borradoresFiltrados.value.length / itemsPorPagina);
});

const borradoresPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina;
  return borradoresFiltrados.value.slice(inicio, inicio + itemsPorPagina);
});

watch(filtroBusqueda, () => {
  paginaActual.value = 1;
});

const irPagina = (num) => {
  if (num >= 1 && num <= totalPaginas.value) paginaActual.value = num;
};

const paginaAnterior = () => {
  if (paginaActual.value > 1) paginaActual.value--;
};

const paginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) paginaActual.value++;
};

const mostrarModalEvaluacion = ref(false);
const enviando = ref(false);
const estudiante = ref({ id: null, nombre: '', proyecto: '' });
const observacionesGenerales = ref('');

const criteriosEvaluacion = ref([
  { id: 1, nombre: 'Dominio del Tema', descripcion: 'Conocimiento del tema', valores: [1, 2, 3, 4, 5], calificacion: '' },
  { id: 2, nombre: 'Claridad', descripcion: 'Presentación clara', valores: [1, 2, 3, 4, 5], calificacion: '' },
  { id: 3, nombre: 'Material de Apoyo', descripcion: 'Calidad de materiales', valores: [1, 2, 3, 4, 5], calificacion: '' },
  { id: 4, nombre: 'Respuestas', descripcion: 'Responde a preguntas', valores: [1, 2, 3, 4, 5], calificacion: '' }
]);

const calificacionFinal = computed(() => {
  const notas = criteriosEvaluacion.value.map(c => Number(c.calificacion)).filter(n => !isNaN(n));
  return notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(2) : '-';
});

const evaluacionValida = computed(() => {
  return criteriosEvaluacion.value.every(c => c.calificacion !== '') && observacionesGenerales.value.trim() !== '';
});

const abrirModalEvaluacion = (borrador) => {
  estudiante.value = {
    id: borrador.estudiante.id,
    nombre: borrador.estudiante.nombre_estudiante,
    proyecto: borrador.titulo
  };
  criteriosEvaluacion.value.forEach(c => (c.calificacion = ''));
  observacionesGenerales.value = '';
  mostrarModalEvaluacion.value = true;
};

const cerrarModalEvaluacion = () => {
  mostrarModalEvaluacion.value = false;
};

const guardarEvaluacion = async () => {
  enviando.value = true;
  try {
    const datos = {
      estudianteId: estudiante.value.id,
      criterios: criteriosEvaluacion.value.map(c => ({ id: c.id, calificacion: c.calificacion })),
      observaciones: observacionesGenerales.value,
      calificacionFinal: calificacionFinal.value
    };
    await new Promise(res => setTimeout(res, 1000));

    alert('Evaluación guardada exitosamente');
    cerrarModalEvaluacion();
  } catch (e) {
    alert('Error al guardar la evaluación');
  } finally {
    enviando.value = false;
  }
};

onMounted(() => {
  listarProyectosDefender();
});
 
</script>
