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
              <h2 class="text-2xl font-bold mb-6">Perfil del Proyecto de Grado</h2>
  
              <!-- Formulario del Perfil -->
              <form @submit.prevent="enviarPerfil" class="space-y-6">
                <!-- Información Básica -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Título del Proyecto</label>
                    <input
                      v-model="perfilProyecto.titulo"
                      type="text"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Área de Investigación</label>
                    <select
                      v-model="perfilProyecto.area"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Seleccione un área</option>
                      <option v-for="area in areasInvestigacion" :key="area" :value="area">
                        {{ area }}
                      </option>
                    </select>
                  </div>
                </div>
  
                <!-- Descripción del Proyecto -->
                <div>
                  <label class="block text-sm font-medium text-gray-700">Descripción del Proyecto</label>
                  <textarea
                    v-model="perfilProyecto.descripcion"
                    rows="4"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  ></textarea>
                </div>
  
                <!-- Objetivos -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Objetivos</label>
                  <div class="space-y-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Objetivo General</h4>
                      <textarea
                        v-model="perfilProyecto.objetivoGeneral"
                        rows="2"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      ></textarea>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700">Objetivos Específicos</h4>
                      <div v-for="(obj, index) in perfilProyecto.objetivosEspecificos" :key="index" class="flex gap-2 mt-2">
                        <textarea
                          v-model="perfilProyecto.objetivosEspecificos[index]"
                          rows="2"
                          class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          required
                        ></textarea>
                        <button
                          type="button"
                          @click="eliminarObjetivo(index)"
                          class="text-red-500 hover:text-red-700"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <button
                        type="button"
                        @click="agregarObjetivo"
                        class="mt-2 text-sm text-primary-600 hover:text-primary-700"
                      >
                        + Agregar objetivo específico
                      </button>
                    </div>
                  </div>
                </div>
  
                <!-- Alcance y Justificación -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Alcance del Proyecto</label>
                    <textarea
                      v-model="perfilProyecto.alcance"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Justificación</label>
                    <textarea
                      v-model="perfilProyecto.justificacion"
                      rows="4"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    ></textarea>
                  </div>
                </div>
  
                <!-- Documentos Adjuntos -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Documentos de Respaldo
                  </label>
                  <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-gray-600">
                        <label class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                          <span>Cargar archivos</span>
                          <input type="file" class="sr-only" multiple @change="handleFileUpload">
                        </label>
                        <p class="pl-1">o arrastrar y soltar</p>
                      </div>
                      <p class="text-xs text-gray-500">
                        PDF, DOC hasta 10MB
                      </p>
                    </div>
                  </div>
                </div>
  
                <!-- Botones de Acción -->
                <div class="flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="guardarBorrador"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Guardar como borrador
                  </button>
                  <button
                    type="submit"
                    :disabled="enviando"
                    class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {{ enviando ? 'Enviando...' : 'Enviar para evaluación' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal de Confirmación -->
      <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">Perfil Enviado con Éxito</h3>
            <p class="mt-2 text-sm text-gray-500">
              Tu perfil de proyecto ha sido enviado para evaluación. Recibirás una notificación cuando sea revisado.
            </p>
            <div class="mt-4">
              <button
                @click="cerrarConfirmacion"
                class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const enviando = ref(false);
  const mostrarConfirmacion = ref(false);
  
  const areasInvestigacion = [
    'Inteligencia Artificial',
    'Desarrollo de Software',
    'Redes y Comunicaciones',
    'Seguridad Informática',
    'Base de Datos',
    'Sistemas de Información'
  ];
  
  const perfilProyecto = ref({
    titulo: '',
    area: '',
    descripcion: '',
    objetivoGeneral: '',
    objetivosEspecificos: [''],
    alcance: '',
    justificacion: '',
    documentos: []
  });
  
  const agregarObjetivo = () => {
    perfilProyecto.value.objetivosEspecificos.push('');
  };
  
  const eliminarObjetivo = (index) => {
    perfilProyecto.value.objetivosEspecificos.splice(index, 1);
  };
  
  const handleFileUpload = (event) => {
    perfilProyecto.value.documentos = Array.from(event.target.files);
  };
  
  const guardarBorrador = async () => {
    try {
      // Aquí iría la lógica para guardar el borrador
      console.log('Guardando borrador:', perfilProyecto.value);
    } catch (error) {
      console.error('Error al guardar el borrador:', error);
    }
  };
  
  const enviarPerfil = async () => {
    try {
      enviando.value = true;
      // Aquí iría la lógica para enviar el perfil
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulación
      mostrarConfirmacion.value = true;
    } catch (error) {
      console.error('Error al enviar el perfil:', error);
    } finally {
      enviando.value = false;
    }
  };
  
  const cerrarConfirmacion = () => {
    mostrarConfirmacion.value = false;
    // Opcional: redirigir o limpiar el formulario
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>