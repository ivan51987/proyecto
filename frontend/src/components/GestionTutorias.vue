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
            <h2 class="text-2xl font-bold mb-6">Gestión de Proyectos de Grado</h2>

            <!-- Filtros -->
            <div class="mb-6 flex space-x-4">
              <select
                v-model="filtroEstado"
                class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Todos los estados</option>
                <option value="en_revision">En Revisión</option>
                <option value="aprobado">Aprobado</option>
                <option value="observado">Observado</option>
                <option value="finalizado">Finalizado</option>
              </select>

              <select
                v-model="filtroCarrera"
                class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Todas las carreras</option>
                <option value="sistemas">Ingeniería de Sistemas</option>
                <option value="informatica">Ingeniería Informática</option>
              </select>
            </div>

            <!-- Lista de proyectos -->
            <div class="space-y-4">
              <div
                v-for="proyecto in proyectosFiltrados"
                :key="proyecto.id"
                class="border rounded-lg p-6 hover:bg-gray-50"
              >
                <div class="flex justify-between items-start">
                  <div class="space-y-2">
                    <h3 class="text-lg font-medium text-gray-900">
                      {{ proyecto.titulo }}
                    </h3>
                    <div class="flex space-x-4 text-sm text-gray-500">
                      <p>
                        <span class="font-medium">Estudiante:</span>
                        {{ proyecto.estudiante }}
                      </p>
                      <p>
                        <span class="font-medium">Tutor:</span>
                        {{ proyecto.tutor }}
                      </p>
                    </div>
                    <p class="text-sm text-gray-600">{{ proyecto.descripcion }}</p>
                    <div class="flex space-x-4 text-sm">
                      <p>
                        <span class="font-medium">Carrera:</span>
                        {{ proyecto.carrera }}
                      </p>
                      <p>
                        <span class="font-medium">Fecha de inicio:</span>
                        {{ new Date(proyecto.fechaInicio).toLocaleDateString() }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-col items-end space-y-2">
                    <span
                      :class="{
                        'px-2 py-1 rounded-full text-sm font-medium': true,
                        'bg-yellow-100 text-yellow-800': proyecto.estado === 'en_revision',
                        'bg-green-100 text-green-800': proyecto.estado === 'aprobado',
                        'bg-red-100 text-red-800': proyecto.estado === 'observado',
                        'bg-blue-100 text-blue-800': proyecto.estado === 'finalizado'
                      }"
                    >
                      {{ formatearEstado(proyecto.estado) }}
                    </span>

                    <div class="flex space-x-2 mt-2" v-if="proyecto.estado === 'en_revision'">
                      <button
                        @click="actualizarEstado(proyecto.id, 'aprobado')"
                        class="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                      >
                        Aprobar
                      </button>
                      <button
                        @click="mostrarObservaciones(proyecto)"
                        class="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600"
                      >
                        Observar
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Progreso del proyecto -->
                <div class="mt-4">
                  <div class="flex items-center">
                    <div class="flex-1">
                      <div class="h-2 bg-gray-200 rounded-full">
                        <div
                          class="h-2 bg-primary-600 rounded-full"
                          :style="{ width: `${proyecto.progreso}%` }"
                        ></div>
                      </div>
                    </div>
                    <span class="ml-2 text-sm text-gray-500">{{ proyecto.progreso }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Observaciones -->
    <div v-if="modalObservaciones" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <h3 class="text-lg font-medium mb-4">Agregar Observaciones</h3>
        <textarea
          v-model="observaciones"
          rows="4"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          placeholder="Escriba las observaciones del proyecto..."
        ></textarea>
        <div class="mt-4 flex justify-end space-x-2">
          <button
            @click="cerrarModal"
            class="px-4 py-2 text-sm text-gray-700 hover:text-gray-500"
          >
            Cancelar
          </button>
          <button
            @click="guardarObservaciones"
            class="px-4 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Navbar from "../components/Navbar.vue";
import Sidebar from "../components/Sidebar.vue";

const isSidebarOpen = ref(false);
const filtroEstado = ref("");
const filtroCarrera = ref("");
const modalObservaciones = ref(false);
const observaciones = ref("");
const proyectoSeleccionado = ref(null);

const proyectos = ref([
  {
    id: 1,
    titulo: "Sistema de Gestión Académica",
    estudiante: "Carlos Martínez",
    tutor: "Dr. Juan Pérez",
    descripcion: "Desarrollo de un sistema web para la gestión académica utilizando Vue.js y Node.js",
    carrera: "Ingeniería de Sistemas",
    fechaInicio: new Date("2024-01-15"),
    estado: "en_revision",
    progreso: 65
  },
  // Más proyectos aquí
]);

const proyectosFiltrados = computed(() => {
  return proyectos.value.filter(proyecto => {
    if (filtroEstado.value && proyecto.estado !== filtroEstado.value) return false;
    if (filtroCarrera.value && !proyecto.carrera.toLowerCase().includes(filtroCarrera.value)) return false;
    return true;
  });
});

const formatearEstado = (estado) => {
  const estados = {
    en_revision: "En Revisión",
    aprobado: "Aprobado",
    observado: "Observado",
    finalizado: "Finalizado"
  };
  return estados[estado] || estado;
};

const actualizarEstado = async (proyectoId, nuevoEstado) => {
  try {
    const proyecto = proyectos.value.find(p => p.id === proyectoId);
    if (proyecto) {
      proyecto.estado = nuevoEstado;
      // Aquí iría la llamada al servicio para actualizar en el backend
    }
  } catch (error) {
    console.error("Error al actualizar el estado:", error);
  }
};

const mostrarObservaciones = (proyecto) => {
  proyectoSeleccionado.value = proyecto;
  modalObservaciones.value = true;
};

const cerrarModal = () => {
  modalObservaciones.value = false;
  observaciones.value = "";
  proyectoSeleccionado.value = null;
};

const guardarObservaciones = async () => {
  try {
    if (proyectoSeleccionado.value && observaciones.value.trim()) {
      await actualizarEstado(proyectoSeleccionado.value.id, "observado");
      // Aquí iría la lógica para guardar las observaciones
      cerrarModal();
    }
  } catch (error) {
    console.error("Error al guardar las observaciones:", error);
  }
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>