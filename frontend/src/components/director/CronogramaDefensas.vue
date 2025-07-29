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

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-xl font-semibold mb-4">
          <strong>Postulante:</strong> {{ selectedEvent.estudiante }}
        </h3>
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
  isPastEvent.value = fechaHora < now;
  daysAgo.value = isPastEvent.value
    ? Math.floor(Math.abs(now - fechaHora) / (1000 * 60 * 60 * 24))
    : 0;

  showModal.value = true;
};
const closeModal = () => showModal.value = false;

const formatDate = (date) =>
  date.toLocaleDateString('es-BO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

const formatTime = (date) =>
  date.toLocaleTimeString('es-BO', {
    hour: '2-digit', minute: '2-digit', hour12: false
  });

const listaProyectos = ref([]);

const defensasProgramadas = async () => {
  try {
    const response = await datosProyectosService.listarDefensasProgramas();
    listaProyectos.value = response;

    const eventos = response.map(proyecto => {
      const fecha = proyecto.fecha.split('T')[0]; 
      const hora = proyecto.hora; 
      const fechaHora = `${fecha}T${hora}`; 

      return {
        title: `Defensa: ${proyecto.estudiante.nombre}`,
        start: fechaHora,
        extendedProps: {
          estudiante: proyecto.estudiante.nombre,
          lugar: proyecto.lugar,
          titulo: proyecto.titulo
        }
      };
    });

    calendarOptions.value.events = eventos;
  } catch (error) {
    console.error('Error al cargar los proyectos:', error);
  }
};

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
  events: [], 
  eventClick: openModal,
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
  defensasProgramadas();
});
</script>
