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
              Panel de Control del Secretario
            </h1>
          </div>

          <!-- Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Estudiantes Registrados -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100">
                  <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5V4H2v16h5m10 0v-6H7v6m10 0v-6h5v6z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Estudiantes Registrados</p>
                  <p class="text-xl font-bold text-gray-800">{{ estudiantesRegistrados }}</p>
                </div>
              </div>
            </div>

            <!-- Documentos Pendientes -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16h8M8 12h8m-8-4h8M4 6h16v12H4z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Documentos Pendientes</p>
                  <p class="text-xl font-bold text-gray-800">{{ documentosPendientes }}</p>
                </div>
              </div>
            </div>

            <!-- Solicitudes Recibidas -->
            <div class="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m-6 8h6M4 6h16v12H4z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <p class="text-sm text-gray-500">Solicitudes Recibidas</p>
                  <p class="text-xl font-bold text-gray-800">{{ solicitudesRecibidas }}</p>
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

// Datos simulados, luego los puedes obtener desde una API
const estudiantesRegistrados = ref(120)
const documentosPendientes = ref(18)
const solicitudesRecibidas = ref(45)
</script>
