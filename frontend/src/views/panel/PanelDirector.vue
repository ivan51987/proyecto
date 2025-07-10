<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <!-- Main -->
    <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-2xl font-bold text-gray-900">
              Panel de Control del Director
            </h1>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Total Proyectos -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-indigo-100">
                  <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 17v-2a4 4 0 014-4h4m0 0v6m0-6l-4 4m-6-2a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Total de Proyectos</p>
                  <p class="text-xl font-bold text-gray-800">{{ totalProyectos }}</p>
                </div>
              </div>
            </div>

            <!-- Aprobados -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Proyectos Aprobados</p>
                  <p class="text-xl font-bold text-gray-800">{{ aprobados }}</p>
                </div>
              </div>
            </div>

            <!-- En Revisión -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">En Revisión</p>
                  <p class="text-xl font-bold text-gray-800">{{ enRevision }}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../../components/Navbar.vue'
import Sidebar from '../../components/Sidebar.vue'

// Estado para el sidebar
const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
// Datos simulados (en un caso real, irían desde una API)
const totalProyectos = ref(42)
const aprobados = ref(28)
const enRevision = ref(10)
</script>
