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
              <h2 class="text-2xl font-bold mb-6">Entrega de Borrador de Proyecto</h2>
  
              <!-- Formulario de Entrega -->
              <div v-if="!entregaRealizada">
                <div class="space-y-6">
                  <!-- Información del Proyecto -->
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <h3 class="text-lg font-medium text-gray-900 mb-2">Información del Proyecto</h3>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-sm text-gray-500">Título del Proyecto</p>
                        <p class="font-medium">{{ proyectoInfo.titulo }}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">Tutor</p>
                        <p class="font-medium">{{ proyectoInfo.tutor }}</p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Subida de Documento -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Documento del Borrador
                    </label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                      <div class="space-y-1 text-center">
                        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div class="flex text-sm text-gray-600">
                          <label class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>Cargar archivo</span>
                            <input 
                              type="file" 
                              class="sr-only" 
                              @change="handleFileUpload"
                              accept=".pdf,.doc,.docx"
                            >
                          </label>
                          <p class="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p class="text-xs text-gray-500">
                          PDF o Word hasta 10MB
                        </p>
                      </div>
                    </div>
                    <div v-if="selectedFile" class="mt-2">
                      <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div class="flex items-center">
                          <svg class="h-5 w-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span class="text-sm text-gray-700">{{ selectedFile.name }}</span>
                        </div>
                        <button
                          type="button"
                          @click="removeFile"
                          class="text-red-500 hover:text-red-700"
                        >
                          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <!-- Comentarios -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Comentarios Adicionales (opcional)
                    </label>
                    <textarea
                      v-model="comentarios"
                      rows="4"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Agregue cualquier comentario o aclaración sobre el borrador..."
                    ></textarea>
                  </div>
  
                  <!-- Botón de Envío -->
                  <div class="flex justify-end">
                    <button
                      type="button"
                      @click="enviarBorrador"
                      :disabled="!selectedFile || enviando"
                      class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                      {{ enviando ? 'Enviando...' : 'Entregar Borrador' }}
                    </button>
                  </div>
                </div>
              </div>
  
              <!-- Mensaje de Éxito -->
              <div v-else class="text-center py-12">
                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="mt-3 text-lg font-medium text-gray-900">
                  ¡Borrador Entregado con Éxito!
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                  Su borrador ha sido enviado correctamente. Recibirá una notificación cuando sea revisado.
                </p>
                <div class="mt-6">
                  <button
                    @click="reiniciarFormulario"
                    class="text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    Volver al inicio
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
  import { ref } from 'vue';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const isSidebarOpen = ref(false);
  const selectedFile = ref(null);
  const comentarios = ref('');
  const enviando = ref(false);
  const entregaRealizada = ref(false);
  
  // Datos de ejemplo del proyecto
  const proyectoInfo = ref({
    titulo: 'Sistema de Gestión Académica',
    tutor: 'Dr. Juan Pérez'
  });
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
        return;
      }
      selectedFile.value = file;
    }
  };
  
  const removeFile = () => {
    selectedFile.value = null;
  };
  
  const enviarBorrador = async () => {
    if (!selectedFile.value) return;
  
    try {
      enviando.value = true;
      
      // Aquí iría la lógica de envío
      const formData = new FormData();
      formData.append('documento', selectedFile.value);
      formData.append('comentarios', comentarios.value);
      
      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      entregaRealizada.value = true;
    } catch (error) {
      console.error('Error al enviar el borrador:', error);
      alert('Ocurrió un error al enviar el borrador. Por favor, intente nuevamente.');
    } finally {
      enviando.value = false;
    }
  };
  
  const reiniciarFormulario = () => {
    selectedFile.value = null;
    comentarios.value = '';
    entregaRealizada.value = false;
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>