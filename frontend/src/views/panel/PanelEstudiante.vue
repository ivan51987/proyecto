<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-2xl font-bold text-gray-900">
              Panel de Control de Estudiante
            </h1>
          </div>

          <!-- Stats Cards -->
          <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 bg-opacity-50">
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5.121 17.804A13.937 13.937 0 0112 15c2.21 0 4.29.536 6.121 1.48M15 12a3 3 0 10-6 0 3 3 0 006 0z" />
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="text-lg font-semibold text-gray-800">Estado del Proyecto</h2>
                <p class="text-sm text-gray-600">Tu proyecto se encuentra actualmente:</p>
                <span
                  class="inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full"
                  :class="estadoClase">
                  {{ estadoProyecto }}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../../components/Navbar.vue'
import Sidebar from '../../components/Sidebar.vue'

const estadoProyecto = ref('En revisión') 

// Estado para el sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const estadoClase = computed(() => {
  switch (estadoProyecto.value) {
    case 'Aprobado':
      return 'bg-green-100 text-green-800'
    case 'Rechazado':
      return 'bg-red-100 text-red-800'
    case 'En revisión':
    default:
      return 'bg-yellow-100 text-yellow-800'
  }
})
</script>
