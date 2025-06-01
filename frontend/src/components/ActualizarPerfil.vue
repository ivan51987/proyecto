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
            <h2 class="text-2xl font-bold mb-6">Actualizar Información Personal</h2>
            
            <!-- Vista previa de la información actual -->
            <div class="mb-6 space-y-4">
              <div class="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">Información Actual</h3>
                  <p class="mt-1 text-sm text-gray-500">Revisa tu información personal actual</p>
                </div>
                <button
                  @click="iniciarEdicion"
                  class="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Editar Información
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Nombre Completo</p>
                  <p class="mt-1 text-sm text-gray-900">{{ formData.nombre || 'No especificado' }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Dirección</p>
                  <p class="mt-1 text-sm text-gray-900">{{ formData.direccion || 'No especificada' }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Teléfono</p>
                  <p class="mt-1 text-sm text-gray-900">{{ formData.telefono || 'No especificado' }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Correo Electrónico</p>
                  <p class="mt-1 text-sm text-gray-900">{{ formData.email || 'No especificado' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de Edición -->
    <div v-if="editando" class="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Fondo oscuro -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelarEdicion"></div>

        <!-- Centro del modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Contenido del Modal -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="actualizarInformacion" class="p-6">
            <div class="mb-6">
              <h3 class="text-lg font-medium text-gray-900">Editar Información Personal</h3>
              <p class="mt-1 text-sm text-gray-500">Actualiza tus datos personales</p>
            </div>

            <div class="space-y-4">
              <!-- Nombre -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                  type="text"
                  v-model="formData.nombre"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <!-- Dirección -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  type="text"
                  v-model="formData.direccion"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <!-- Teléfono -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  v-model="formData.telefono"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <input
                  type="email"
                  v-model="formData.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                @click="cancelarEdicion"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isLoading"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                <span v-if="isLoading">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Actualizando...
                </span>
                <span v-else>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Mensajes de notificación -->
    <div
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-green-50 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center"
    >
      <svg class="h-5 w-5 text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
      Información actualizada correctamente
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from './Navbar.vue';
import Sidebar from './Sidebar.vue';

// Estado
const isSidebarOpen = ref(false);
const isLoading = ref(false);
const showSuccess = ref(false);
const error = ref('');
const editando = ref(false);

const formData = ref({
  nombre: '',
  direccion: '',
  telefono: '',
  email: ''
});

// Cargar datos del usuario
const cargarDatosUsuario = async () => {
  try {
    // Simulación de carga de datos
    const datosUsuario = {
      nombre: 'Juan Pérez',
      direccion: 'Calle Principal 123',
      telefono: '555-0123',
      email: 'juan@ejemplo.com'
    };
    formData.value = datosUsuario;
  } catch (err) {
    error.value = 'Error al cargar los datos del usuario';
  }
};

const iniciarEdicion = () => {
  editando.value = true;
};

const cancelarEdicion = () => {
  editando.value = false;
  cargarDatosUsuario(); // Recargar datos originales
};

const actualizarInformacion = async () => {
  try {
    isLoading.value = true;
    error.value = '';
    
    // Simulación de actualización
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showSuccess.value = true;
    editando.value = false;
    setTimeout(() => {
      showSuccess.value = false;
    }, 3000);
  } catch (err) {
    error.value = 'Error al actualizar la información. Por favor, intente nuevamente.';
  } finally {
    isLoading.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  cargarDatosUsuario();
});

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
</script>