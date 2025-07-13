<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main :class="['pt-16 transition-all duration-300', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Registrar Proyecto</h2>
          <form @submit.prevent="enviarProyecto" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Título del Proyecto</label>
              <input v-model.trim="proyecto.titulo" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required />
            </div>
            <!-- Tipo de Tutoría -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Tutoría
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button v-for="tipo in tiposTutoria" :key="tipo.id" type="button"
                  @click="proyecto.tipoTutoria = tipo.id" :class="[
                    'p-4 border rounded-lg text-left',
                    proyecto.tipoTutoria === tipo.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  ]">
                  <div class="font-medium">{{ tipo.nombre }}</div>
                  <div class="text-sm text-gray-500">{{ tipo.descripcion }}</div>
                </button>
              </div>
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
import { ref } from 'vue'
import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'
import datosService from "../services/estudianteService";
import { alertaExito, alertaError, alertaConfirmacion } from '../utils/alertas'
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

const tiposTutoria = [
  {
    id: 'tesis',
    nombre: 'Tesis',
    descripcion: 'Trabajo de investigación, presentada públicamente, para obtener un grado académico universitario, producto del estudio teórico de un tema original, pudiendo ajustarse a cualquier modelo o paradigma de investigación y que, realizada con rigor metodológico, debe contener, en sus conclusiones, aspectos propositivos.'
  },
  {
    id: 'proyecto_pet',
    nombre: 'Programa especial de titulación(P.E.T.)',
    descripcion: 'Es el trabajo de investigación, programación y diseño de solución a algún problema o situación, aplicando estrategias apropiadas.'
  },
  {
    id: 'proyecto_grado_dirigido',
    nombre: 'Proyecto de Grado Dirigido',
    descripcion: 'Es la ejecución y evaluación del diseño de un proyecto en diferentes instituciones fuera de la universidad respaldada por un convenio interinstitucional.'
  },
  {
    id: 'diplomado',
    nombre: 'Proyecto de Grado por Diplomado',
    descripcion: 'Modalidad de graduación que se rige en el aprovechamiento académico obtenido por el estudiante durante su permanencia en un programa de formación a nivel de licenciatura, expresado en indicadores cuantitativos (promedios y mediana) e indicadores cualitativos (tiempo de duración de estudios, aprobación en primera instancia, no abandonos).'
  }
];

// Modelo de proyecto
const proyecto = ref({
  area: '',
  titulo: '',
  descripcion: '',
  tipoTutoria: ''
})

// Estado de carga
const enviando = ref(false)

// Enviar solicitud al backend
const enviarProyecto = async () => {
  if (!proyecto.value.titulo || !proyecto.value.descripcion || !proyecto.value.tipoTutoria) {
    alertaError('Debe lletodos los campos')
    return
  }

    const confirmacion = await alertaConfirmacion({
      title: '¿Deseas guardar este registro?',
      text: 'Una vez guardado, no podrás editarlo.',
      confirmText: 'Sí, guardar',
      cancelText: 'Cancelar'
    })
    if (confirmacion.isConfirmed) {
      try {
        enviando.value = true
        const response = await datosService.registrarProyecto(proyecto.value)
        if(response.registrado){
          proyecto.value = {
            titulo: '',
            descripcion: '',
            tipoTutoria: ''
          }
          alertaExito(response.message)
        }else{
          enviando.value = false  
          alertaError(response.message)  
        }
      } catch (error) {
        alertaError('No se pudo guardar el registro')
      }
    }
}
</script>
