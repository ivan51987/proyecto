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
                <h2 class="text-2xl font-bold mb-6">Asignación de Tribunal Evaluador</h2>
  
                <!-- Selección de Proyecto -->
                <div class="mb-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Seleccionar Proyecto</h3>
                  <select
                    v-model="proyectoSeleccionado"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    @change="cargarDocentesDisponibles"
                  >
                    <option value="">Seleccione un proyecto</option>
                    <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
                      {{ proyecto.titulo }} - {{ proyecto.estudiante }}
                    </option>
                  </select>
                </div>
  
                <!-- Lista de Docentes Disponibles -->
                <div v-if="proyectoSeleccionado" class="mb-8">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900">Docentes Disponibles</h3>
                    <div class="flex space-x-2">
                      <input
                        type="text"
                        v-model="busqueda"
                        placeholder="Buscar docente..."
                        class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <select
                        v-model="filtroArea"
                        class="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="">Todas las áreas</option>
                        <option v-for="area in areas" :key="area" :value="area">
                          {{ area }}
                        </option>
                      </select>
                    </div>
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
                            Experiencia
                          </th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seleccionar
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="docente in docentesFiltrados" :key="docente.id">
                          <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm font-medium text-gray-900">{{ docente.nombre }}</div>
                            <div class="text-sm text-gray-500">{{ docente.email }}</div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {{ docente.area }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {{ docente.experiencia }} años
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              v-model="docentesSeleccionados"
                              :value="docente.id"
                              :disabled="docentesSeleccionados.length >= 3 && !docentesSeleccionados.includes(docente.id)"
                              class="rounded text-primary-600 focus:ring-primary-500"
                            >
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
  
                  <!-- Mensaje de Selección -->
                  <p class="mt-4 text-sm text-gray-500">
                    Seleccione 3 docentes para formar el tribunal evaluador
                  </p>
                </div>
  
                <!-- Botones de Acción -->
                <div class="flex justify-end space-x-3">
                  <button
                    @click="cancelarAsignacion"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    @click="confirmarAsignacion"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                    :disabled="!asignacionValida || enviando"
                  >
                    {{ enviando ? 'Asignando...' : 'Asignar Tribunal' }}
                  </button>
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
            Confirmar Asignación
          </h3>
          <p class="text-sm text-gray-500">
            ¿Está seguro de que desea asignar estos docentes como tribunal evaluador?
          </p>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="mostrarConfirmacion = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              @click="guardarAsignacion"
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
  const proyectoSeleccionado = ref('');
  const docentesSeleccionados = ref([]);
  const busqueda = ref('');
  const filtroArea = ref('');
  const mostrarConfirmacion = ref(false);
  const enviando = ref(false);
  
  // Datos de ejemplo
  const proyectos = ref([
    {
      id: 1,
      titulo: 'Sistema de Gestión Académica',
      estudiante: 'Ana García',
      area: 'Desarrollo de Software'
    },
    {
      id: 2,
      titulo: 'Aplicación IoT para Agricultura',
      estudiante: 'Carlos Rodríguez',
      area: 'Internet de las Cosas'
    }
  ]);
  
  const docentes = ref([
    {
      id: 1,
      nombre: 'Dr. Juan Pérez',
      email: 'juan.perez@universidad.edu',
      area: 'Desarrollo de Software',
      experiencia: 10
    },
    {
      id: 2,
      nombre: 'Dra. María López',
      email: 'maria.lopez@universidad.edu',
      area: 'Inteligencia Artificial',
      experiencia: 8
    },
    {
      id: 3,
      nombre: 'Dr. Roberto Sánchez',
      email: 'roberto.sanchez@universidad.edu',
      area: 'Redes',
      experiencia: 12
    },
    {
      id: 4,
      nombre: 'Dra. Ana Martínez',
      email: 'ana.martinez@universidad.edu',
      area: 'Base de Datos',
      experiencia: 15
    }
  ]);
  
  const areas = computed(() => {
    return [...new Set(docentes.value.map(d => d.area))];
  });
  
  const docentesFiltrados = computed(() => {
    return docentes.value.filter(d => {
      const cumpleBusqueda = d.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
      const cumpleFiltroArea = !filtroArea.value || d.area === filtroArea.value;
      return cumpleBusqueda && cumpleFiltroArea;
    });
  });
  
  const asignacionValida = computed(() => {
    return proyectoSeleccionado.value && docentesSeleccionados.value.length === 3;
  });
  
  const cargarDocentesDisponibles = async () => {
    try {
      // Aquí iría la lógica para obtener docentes disponibles del backend
      // Por ahora usamos los datos de ejemplo
    } catch (error) {
      console.error('Error al cargar docentes:', error);
    }
  };
  
  const confirmarAsignacion = () => {
    if (!asignacionValida.value) return;
    mostrarConfirmacion.value = true;
  };
  
  const guardarAsignacion = async () => {
    try {
      enviando.value = true;
      
      // Preparar datos de asignación
      const asignacion = {
        proyectoId: proyectoSeleccionado.value,
        docentesIds: docentesSeleccionados.value
      };
  
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Mostrar mensaje de éxito y reiniciar formulario
      alert('Tribunal asignado exitosamente');
      cancelarAsignacion();
    } catch (error) {
      console.error('Error al guardar la asignación:', error);
      alert('Error al asignar el tribunal');
    } finally {
      enviando.value = false;
      mostrarConfirmacion.value = false;
    }
  };
  
  const cancelarAsignacion = () => {
    proyectoSeleccionado.value = '';
    docentesSeleccionados.value = [];
    busqueda.value = '';
    filtroArea.value = '';
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>