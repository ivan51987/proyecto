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
                <h2 class="text-2xl font-bold mb-6">Seguimiento de Proyectos en Tiempo Real</h2>
  
                <!-- Filtros -->
                <div class="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Estado del Proyecto
                    </label>
                    <select
                      v-model="filtros.estado"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Todos los estados</option>
                      <option v-for="estado in estados" :key="estado" :value="estado">
                        {{ estado }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Tutor Asignado
                    </label>
                    <select
                      v-model="filtros.tutor"
                      class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Todos los tutores</option>
                      <option v-for="tutor in tutores" :key="tutor.id" :value="tutor.id">
                        {{ tutor.nombre }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Rango de Fechas
                    </label>
                    <div class="flex space-x-2">
                      <input
                        type="date"
                        v-model="filtros.fechaInicio"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <input
                        type="date"
                        v-model="filtros.fechaFin"
                        class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
  
                <!-- Lista de Proyectos -->
                <div class="space-y-6">
                  <div v-for="proyecto in proyectosFiltrados" :key="proyecto.id"
                       class="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div class="flex items-start justify-between">
                      <div class="flex-1">
                        <div class="flex items-center">
                          <h3 class="text-lg font-medium text-gray-900">{{ proyecto.titulo }}</h3>
                          <span
                            class="ml-2 px-2 py-1 text-xs font-medium rounded-full"
                            :class="getEstadoClase(proyecto.estado)"
                          >
                            {{ proyecto.estado }}
                          </span>
                        </div>
                        <div class="mt-2 grid grid-cols-2 gap-4">
                          <div>
                            <p class="text-sm text-gray-500">Estudiante</p>
                            <p class="font-medium">{{ proyecto.estudiante }}</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Tutor</p>
                            <p class="font-medium">{{ proyecto.tutor }}</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Fecha de Inicio</p>
                            <p class="font-medium">{{ formatearFecha(proyecto.fechaInicio) }}</p>
                          </div>
                          <div>
                            <p class="text-sm text-gray-500">Último Avance</p>
                            <p class="font-medium">{{ formatearFecha(proyecto.ultimoAvance) }}</p>
                          </div>
                        </div>
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
                            <span class="ml-2 text-sm font-medium text-gray-700">
                              {{ proyecto.progreso }}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        @click="verDetalles(proyecto)"
                        class="ml-4 px-4 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
  
                  <!-- Estado sin proyectos -->
                  <div v-if="proyectosFiltrados.length === 0" class="text-center py-12">
                    <svg
                      class="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No hay proyectos</h3>
                    <p class="mt-1 text-sm text-gray-500">
                      No se encontraron proyectos que coincidan con los filtros seleccionados.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  
      <!-- Modal de Detalles -->
      <div v-if="proyectoSeleccionado" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              Detalles del Proyecto
            </h3>
            <button
              @click="cerrarDetalles"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium text-gray-900">Información General</h4>
              <div class="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Título</p>
                  <p class="font-medium">{{ proyectoSeleccionado.titulo }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Estado</p>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="getEstadoClase(proyectoSeleccionado.estado)"
                  >
                    {{ proyectoSeleccionado.estado }}
                  </span>
                </div>
              </div>
            </div>
  
            <div class="space-y-4">
              <h4 class="font-medium text-gray-900">Historial de Avances</h4>
              <div class="space-y-2">
                <div v-for="avance in proyectoSeleccionado.avances" :key="avance.id"
                     class="bg-white p-3 border rounded-lg"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-sm font-medium">{{ avance.descripcion }}</p>
                      <p class="text-xs text-gray-500">{{ formatearFecha(avance.fecha) }}</p>
                    </div>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getAvanceClase(avance.tipo)"
                    >
                      {{ avance.tipo }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
  const proyectoSeleccionado = ref(null);
  const filtros = ref({
    estado: '',
    tutor: '',
    fechaInicio: '',
    fechaFin: ''
  });
  
  // Datos de ejemplo
  const estados = ['En Proceso', 'En Revisión', 'Aprobado', 'En Corrección', 'Finalizado'];
  const tutores = [
    { id: 1, nombre: 'Dr. Juan Pérez' },
    { id: 2, nombre: 'Dra. María López' },
    { id: 3, nombre: 'Dr. Carlos Rodríguez' }
  ];
  
  const proyectos = ref([
    {
      id: 1,
      titulo: 'Sistema de Gestión Académica',
      estudiante: 'Ana García',
      tutor: 'Dr. Juan Pérez',
      estado: 'En Proceso',
      fechaInicio: '2024-01-01',
      ultimoAvance: '2024-01-15',
      progreso: 45,
      avances: [
        {
          id: 1,
          descripcion: 'Entrega de perfil de proyecto',
          fecha: '2024-01-01',
          tipo: 'Documento'
        },
        {
          id: 2,
          descripcion: 'Primera revisión completada',
          fecha: '2024-01-10',
          tipo: 'Revisión'
        }
      ]
    },
    {
      id: 2,
      titulo: 'Aplicación IoT para Agricultura',
      estudiante: 'Carlos Rodríguez',
      tutor: 'Dra. María López',
      estado: 'En Revisión',
      fechaInicio: '2024-01-05',
      ultimoAvance: '2024-01-18',
      progreso: 60,
      avances: [
        {
          id: 1,
          descripcion: 'Entrega de borrador inicial',
          fecha: '2024-01-05',
          tipo: 'Documento'
        },
        {
          id: 2,
          descripcion: 'Revisión de metodología',
          fecha: '2024-01-15',
          tipo: 'Revisión'
        }
      ]
    }
  ]);
  
  const proyectosFiltrados = computed(() => {
    return proyectos.value.filter(proyecto => {
      const cumpleEstado = !filtros.value.estado || proyecto.estado === filtros.value.estado;
      const cumpleTutor = !filtros.value.tutor || proyecto.tutor === filtros.value.tutor;
      const cumpleFechaInicio = !filtros.value.fechaInicio || 
                               new Date(proyecto.fechaInicio) >= new Date(filtros.value.fechaInicio);
      const cumpleFechaFin = !filtros.value.fechaFin || 
                            new Date(proyecto.ultimoAvance) <= new Date(filtros.value.fechaFin);
  
      return cumpleEstado && cumpleTutor && cumpleFechaInicio && cumpleFechaFin;
    });
  });
  
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getEstadoClase = (estado) => {
    const clases = {
      'En Proceso': 'bg-yellow-100 text-yellow-800',
      'En Revisión': 'bg-blue-100 text-blue-800',
      'Aprobado': 'bg-green-100 text-green-800',
      'En Corrección': 'bg-red-100 text-red-800',
      'Finalizado': 'bg-gray-100 text-gray-800'
    };
    return clases[estado] || 'bg-gray-100 text-gray-800';
  };
  
  const getAvanceClase = (tipo) => {
    const clases = {
      'Documento': 'bg-blue-100 text-blue-800',
      'Revisión': 'bg-green-100 text-green-800',
      'Corrección': 'bg-yellow-100 text-yellow-800'
    };
    return clases[tipo] || 'bg-gray-100 text-gray-800';
  };
  
  const verDetalles = (proyecto) => {
    proyectoSeleccionado.value = proyecto;
  };
  
  const cerrarDetalles = () => {
    proyectoSeleccionado.value = null;
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>