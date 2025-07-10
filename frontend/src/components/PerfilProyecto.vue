<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main :class="['pt-16 transition-all duration-300', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Registrar Proyecto</h2>

          <!-- Mensaje de respuesta -->
          <div v-if="mensaje" :class="mensajeClase" class="mb-4 p-3 rounded-md text-sm">
            {{ mensaje }}
          </div>

          <form @submit.prevent="enviarProyecto" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Título del Proyecto</label>
              <input v-model.trim="proyecto.titulo" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Área de Investigación</label>
              <select v-model="proyecto.area"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required>
                <option value="">Seleccione un área</option>
                <option v-for="area in areasInvestigacion" :key="area" :value="area">
                  {{ area }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea v-model.trim="proyecto.descripcion" rows="4"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
              <input v-model="proyecto.fecha_inicio" type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required />
            </div>

            <div class="flex justify-end">
              <button type="submit" :disabled="enviando"
                class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50">
                <span v-if="enviando">Enviando...</span>
                <span v-else>Registrar Proyecto</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import datosService from "../services/estudianteService";
// Estado UI
const isSidebarOpen = ref(false)
const toggleSidebar = () => (isSidebarOpen.value = !isSidebarOpen.value)

const areasInvestigacion = [
  'Inteligencia Artificial',
  'Desarrollo de Software',
  'Redes y Comunicaciones',
  'Seguridad Informática',
  'Base de Datos',
  'Sistemas de Información',
  'Otros'
];

// Modelo de proyecto
const proyecto = ref({
  area: '',
  titulo: '',
  descripcion: '',
  fecha_inicio: ''
})

// Estado de carga y mensajes
const enviando = ref(false)
const mensaje = ref('')
const exito = ref(false)

// Estilo dinámico para el mensaje
const mensajeClase = computed(() => {
  return exito.value
    ? 'bg-green-100 text-green-800 border border-green-300'
    : 'bg-red-100 text-red-800 border border-red-300'
})

// Enviar solicitud al backend
const enviarProyecto = async () => {
  if (!proyecto.value.titulo || !proyecto.value.descripcion || !proyecto.value.fecha_inicio) {
    mensaje.value = 'Por favor, completa todos los campos.'
    exito.value = false
    return
  }

  enviando.value = true
  mensaje.value = ''

  try {
    const response = await datosService.registrarProyecto(proyecto.value)
    console.log('Respuesta del servidor:', response);

    exito.value = true
    mensaje.value = 'Proyecto registrado correctamente.'

    // Limpiar formulario
    proyecto.value = {
      titulo: '',
      descripcion: '',
      fecha_inicio: ''
    }

  } catch (err) {
    exito.value = false
    mensaje.value = err.message
  } finally {
    enviando.value = false
  }
}
</script>
