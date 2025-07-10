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
                <h2 class="text-2xl font-bold mb-6">Asignación de Fecha y Hora de Defensa</h2>
  
                <!-- Selección de Proyecto -->
                <div class="mb-8">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Seleccionar Proyecto</h3>
                  <select
                    v-model="proyectoSeleccionado"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    @change="cargarDatosProyecto"
                  >
                    <option value="">Seleccione un proyecto</option>
                    <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
                      {{ proyecto.titulo }} - {{ proyecto.estudiante }}
                    </option>
                  </select>
                </div>
  
                <!-- Información del Proyecto -->
                <div v-if="datosProyecto" class="mb-8 bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-lg font-medium text-gray-900 mb-4">Detalles del Proyecto</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm font-medium text-gray-500">Estudiante</p>
                      <p class="mt-1">{{ datosProyecto.estudiante }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Tutor</p>
                      <p class="mt-1">{{ datosProyecto.tutor }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Estado</p>
                      <p class="mt-1">{{ datosProyecto.estado }}</p>
                    </div>
                    <div>
                      <p class="text-sm font-medium text-gray-500">Tribunal Asignado</p>
                      <p class="mt-1">{{ datosProyecto.tribunal ? 'Sí' : 'No' }}</p>
                    </div>
                  </div>
                </div>
  
                <!-- Formulario de Asignación -->
                <div v-if="datosProyecto" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Defensa
                    </label>
                    <input
                      type="date"
                      v-model="fechaDefensa"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      :min="fechaMinima"
                    />
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Defensa
                    </label>
                    <input
                      type="time"
                      v-model="horaDefensa"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Lugar
                    </label>
                    <input
                      type="text"
                      v-model="lugarDefensa"
                      placeholder="Ej: Sala de Conferencias A-101"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
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
                      {{ enviando ? 'Guardando...' : 'Asignar Fecha' }}
                    </button>
                  </div>
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
            ¿Está seguro de que desea programar la defensa para el siguiente horario?
          </p>
          <div class="mt-4 bg-gray-50 p-4 rounded-lg">
            <p><strong>Fecha:</strong> {{ formatearFecha(fechaDefensa) }}</p>
            <p><strong>Hora:</strong> {{ formatearHora(horaDefensa) }}</p>
            <p><strong>Lugar:</strong> {{ lugarDefensa }}</p>
          </div>
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
  import Navbar from '../Navbar.vue';
  import Sidebar from '../Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const proyectoSeleccionado = ref('');
  const datosProyecto = ref(null);
  const fechaDefensa = ref('');
  const horaDefensa = ref('');
  const lugarDefensa = ref('');
  const mostrarConfirmacion = ref(false);
  const enviando = ref(false);
  
  // Datos de ejemplo
  const proyectos = ref([
    {
      id: 1,
      titulo: 'Sistema de Gestión Académica',
      estudiante: 'Ana García',
      tutor: 'Dr. Juan Pérez',
      estado: 'Borrador Aprobado',
      tribunal: true
    },
    {
      id: 2,
      titulo: 'Aplicación IoT para Agricultura',
      estudiante: 'Carlos Rodríguez',
      tutor: 'Dra. María López',
      estado: 'Borrador Aprobado',
      tribunal: true
    }
  ]);
  
  const fechaMinima = computed(() => {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1); // Mínimo un día después
    return hoy.toISOString().split('T')[0];
  });
  
  const asignacionValida = computed(() => {
    return fechaDefensa.value && 
           horaDefensa.value && 
           lugarDefensa.value.trim() !== '';
  });
  const cargarDatosProyecto = async () => {
  try {
    const response = await datosProyectosService.listarProyectos();
    proyectos.value = response;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};
 
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const formatearHora = (hora) => {
    return hora;
  };
  
  const confirmarAsignacion = () => {
    if (!asignacionValida.value) return;
    mostrarConfirmacion.value = true;
  };
  
  const guardarAsignacion = async () => {
    try {
      enviando.value = true;
      
      // Preparar datos
      const asignacion = {
        proyectoId: proyectoSeleccionado.value,
        fecha: fechaDefensa.value,
        hora: horaDefensa.value,
        lugar: lugarDefensa.value
      };
  
      // Simular envío al backend
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Enviar notificación al estudiante
      await enviarNotificacionEstudiante(datosProyecto.value.estudiante, asignacion);
  
      // Mostrar mensaje de éxito y reiniciar formulario
      alert('Fecha de defensa asignada exitosamente');
      cancelarAsignacion();
    } catch (error) {
      console.error('Error al guardar la asignación:', error);
      alert('Error al asignar la fecha de defensa');
    } finally {
      enviando.value = false;
      mostrarConfirmacion.value = false;
    }
  };
  
  const enviarNotificacionEstudiante = async (estudiante, asignacion) => {
    try {
      // Simular envío de notificación
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('Notificación enviada al estudiante:', estudiante);
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  };
  
  const cancelarAsignacion = () => {
    proyectoSeleccionado.value = '';
    datosProyecto.value = null;
    fechaDefensa.value = '';
    horaDefensa.value = '';
    lugarDefensa.value = '';
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>