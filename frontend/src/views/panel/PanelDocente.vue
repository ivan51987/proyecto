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
              Panel de Control del Docente
            </h1>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Defensas Programadas -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100">
                  <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 4h10M5 11h14M9 15h6M7 19h10" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Defensas Programadas</p>
                  <p class="text-xl font-bold text-gray-800">{{ defensasProgramadas }}</p>
                </div>
              </div>
            </div>

            <!-- Proyectos Evaluados -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100">
                  <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Proyectos Evaluados</p>
                  <p class="text-xl font-bold text-gray-800">{{ proyectosEvaluados }}</p>
                </div>
              </div>
            </div>

            <!-- Actas Pendientes -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-red-100">
                  <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12h.01M12 12h.01M9 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Actas Pendientes</p>
                  <p class="text-xl font-bold text-gray-800">{{ actasPendientes }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Puedes agregar más secciones aquí -->
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Navbar from '../../components/Navbar.vue'
import Sidebar from '../../components/Sidebar.vue'

const isSidebarOpen = ref(false)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
// Datos simulados
const defensasProgramadas = ref(5)
const proyectosEvaluados = ref(22)
const actasPendientes = ref(3)
</script>
