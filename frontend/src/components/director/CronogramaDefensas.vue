<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold mb-6">Cronograma de Defensas (Calendario)</h2>
              <FullCalendar :options="calendarOptions" class="rounded-lg shadow border border-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal Ver Evento -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4"><strong>Postulante:</strong>{{ selectedEvent.estudiante }}</h3>
        <p class="mb-2"><strong>Lugar de la defensa:</strong> {{ selectedEvent.lugar }}</p>
        <p class="mb-2"><strong>Tema de la defensa:</strong> {{ selectedEvent.titulo }}</p>
        <p class="mb-2"><strong>Fecha:</strong> {{ formatDate(selectedEvent.fechaHora) }}</p>
        <p class="mb-2"><strong>Hora:</strong> {{ formatTime(selectedEvent.fechaHora) }}</p>
        <p v-if="isPastEvent" class="mt-2 text-sm text-red-500">
          Esta defensa ya fue realizada hace {{ daysAgo }} día(s).
        </p>
        <div class="text-right mt-4">
          <button @click="closeModal" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Modal Crear Evento -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">Registrar Nueva Defensa</h3>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Seleccionar Proyecto</label>
          <select v-model="proyectoSeleccionado" @change="cargarDatosProyecto"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="">Seleccione un proyecto</option>
            <option v-for="(proyecto, index) in calendarOptions.events" :key="index" :value="index">
              {{ proyecto.extendedProps.titulo }} - {{ proyecto.extendedProps.estudiante }}
            </option>
          </select>
        </div>

        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Fecha seleccionada:</label>
          <p class="text-gray-700">{{ newEventDate }}</p>
        </div>

        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Hora (HH:MM)</label>
          <input v-model="newEventTime" type="time" class="w-full border rounded px-3 py-2" required />
        </div>

        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Estudiante</label>
          <input :value="datosProyecto?.extendedProps.estudiante || ''" class="w-full border rounded px-3 py-2 bg-gray-100" readonly />
        </div>

        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Lugar</label>
          <input v-model="newEventData.lugar" class="w-full border rounded px-3 py-2" required />
        </div>

        <div class="mb-2">
          <label class="block text-sm font-medium mb-1">Tema</label>
          <input :value="datosProyecto?.extendedProps.titulo || ''" class="w-full border rounded px-3 py-2 bg-gray-100" readonly />
        </div>

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

        <div class="text-right mt-4">
          <button @click="showCreateModal = false" class="px-4 py-2 mr-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button @click="addNewEvent" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

import datosProyectosService from "../../services/directorService";

const isSidebarOpen = ref(true);
const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;

const showModal = ref(false);
const selectedEvent = ref({ estudiante: '', lugar: '', titulo: '', fechaHora: '' });
const isPastEvent = ref(false);
const daysAgo = ref(0);

const openModal = (eventInfo) => {
  const event = eventInfo.event;
  const fechaHora = new Date(event.start);

  selectedEvent.value = {
    estudiante: event.extendedProps.estudiante || event.title,
    lugar: event.extendedProps.lugar,
    titulo: event.extendedProps.titulo,
    fechaHora,
  };

  const now = new Date();
  if (fechaHora < now) {
    isPastEvent.value = true;
    const diffTime = Math.abs(now - fechaHora);
    daysAgo.value = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } else {
    isPastEvent.value = false;
    daysAgo.value = 0;
  }

  showModal.value = true;
};
const closeModal = () => showModal.value = false;

const showCreateModal = ref(false);
const newEventDate = ref('');
const newEventTime = ref('');
const newEventData = ref({ lugar: '' });
const errorMessage = ref('');
const proyectoSeleccionado = ref('');
const datosProyecto = ref(null);

const cargarDatosProyecto = async () => {
  try {
    const response = await datosProyectosService.listarProyectos();
    datosProyecto.value = response;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};

const addNewEvent = () => {
  if (!newEventTime.value || !datosProyecto.value?.extendedProps.estudiante || !newEventData.value.lugar || !datosProyecto.value?.extendedProps.titulo) {
    errorMessage.value = 'Por favor complete todos los campos.';
    return;
  }

  const fullDateTime = `${newEventDate.value}T${newEventTime.value}`;
  const newDate = new Date(fullDateTime);

  const duplicate = calendarOptions.value.events.some(event => {
    return new Date(event.start).toISOString().slice(0, 16) === newDate.toISOString().slice(0, 16);
  });

  if (duplicate) {
    errorMessage.value = 'Ya existe una defensa registrada en esta fecha y hora.';
    return;
  }

  calendarOptions.value.events.push({
    title: `Defensa: ${datosProyecto.value.extendedProps.estudiante}`,
    start: fullDateTime,
    extendedProps: {
      estudiante: datosProyecto.value.extendedProps.estudiante,
      lugar: newEventData.value.lugar,
      titulo: datosProyecto.value.extendedProps.titulo,
    }
  });

  showCreateModal.value = false;
  errorMessage.value = '';
};

const formatDate = (date) => date.toLocaleDateString('es-BO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (date) => date.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', hour12: false });

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locales: [esLocale],
  locale: 'es',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek',
  },
  events: [
    {
      title: 'Defensa: Ana García',
      start: '2025-07-01T10:00:00',
      extendedProps: {
        estudiante: 'Ana García',
        lugar: 'Sala A-101',
        titulo: 'Sistema de Gestión Académica',
      }
    },
    {
      title: 'Defensa: Carlos López',
      start: '2025-07-10T14:00:00',
      extendedProps: {
        estudiante: 'Carlos López',
        lugar: 'Sala B-202',
        titulo: 'Plataforma E-learning',
      }
    },
    {
      title: 'Defensa: María Pérez',
      start: '2025-06-15T09:00:00',
      extendedProps: {
        estudiante: 'María Pérez',
        lugar: 'Sala C-303',
        titulo: 'Aplicación Móvil de Salud',
      }
    },
    {
      title: 'Defensa: Luis Fernández',
      start: '2025-04-20T11:00:00',
      extendedProps: {
        estudiante: 'Luis Fernández',
        lugar: 'Sala D-404',
        titulo: 'Sistema de Inventario Inteligente',
      }
    }
  ],
  eventClick: openModal,
  dateClick(info) {
    newEventDate.value = info.dateStr;
    newEventTime.value = '';
    newEventData.value = { lugar: '' };
    proyectoSeleccionado.value = '';
    datosProyecto.value = null;
    errorMessage.value = '';
    showCreateModal.value = true;
  },
  eventDidMount(info) {
    const now = new Date();
    const eventDate = new Date(info.event.start);
    const el = info.el;

    if (eventDate < now) {
      el.style.backgroundColor = '#9ca3af';
      el.style.borderColor = '#9ca3af';
      el.style.color = 'white';
    } else {
      el.style.backgroundColor = '#3b82f6';
      el.style.borderColor = '#3b82f6';
      el.style.color = 'white';
    }
  }
});

onMounted(() => {
  cargarDatosProyecto();
});
</script>
