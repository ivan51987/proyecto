<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />
    
    <!-- Main -->
    <main class="pt-16 transition-all duration-300"
          :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
      <div class="px-4 sm:px-6 lg:px-8 py-8">
        <div class="max-w-7xl mx-auto">
          <!-- Header -->
          <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 class="text-2xl font-bold text-gray-900">
              Panel de Control de Tutorías
            </h1>
            <div class="mt-4 sm:mt-0">
              <button class="btn-primary" @click="nuevaSolicitud">
                Nueva Solicitud
              </button>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Tutorías Activas -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-primary-100 bg-opacity-50">
                  <svg class="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div class="ml-5">
                  <div class="text-sm font-medium text-gray-500">Tutorías Activas</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">24</div>
                  <div class="mt-1 text-sm text-green-600">8 nuevas este mes</div>
                </div>
              </div>
            </div>

            <!-- Solicitudes Pendientes -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100 bg-opacity-50">
                  <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5">
                  <div class="text-sm font-medium text-gray-500">Solicitudes Pendientes</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">12</div>
                  <div class="mt-1 text-sm text-yellow-600">Por revisar</div>
                </div>
              </div>
            </div>

            <!-- Tutorías Completadas -->
            <div class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 bg-opacity-50">
                  <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div class="ml-5">
                  <div class="text-sm font-medium text-gray-500">Tutorías Completadas</div>
                  <div class="mt-1 text-3xl font-semibold text-gray-900">156</div>
                  <div class="mt-1 text-sm text-green-600">+15% este mes</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actividad Reciente -->
          <div class="mt-8">
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-medium text-gray-900">Actividad Reciente</h2>
              <div class="mt-6 flow-root">
                <ul class="-my-5 divide-y divide-gray-200">
                  <li v-for="actividad in actividadesRecientes" :key="actividad.id" class="py-5">
                    <div class="flex items-center space-x-4">
                      <div class="flex-shrink-0">
                        <img class="h-8 w-8 rounded-full" :src="actividad.avatar" :alt="actividad.usuario">
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ actividad.mensaje }}
                        </p>
                        <p class="text-sm text-gray-500">
                          {{ actividad.tiempo }}
                        </p>
                      </div>
                      <div>
                        <span :class="[
                          'px-2 py-1 text-xs font-medium rounded-full',
                          actividad.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          actividad.estado === 'aceptada' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        ]">
                          {{ actividad.estado }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
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
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const isSidebarOpen = ref(false)

const actividadesRecientes = ref([
  {
    id: 1,
    usuario: 'María González',
    avatar: 'https://ui-avatars.com/api/?name=María+González',
    mensaje: 'Nueva solicitud de tutoría en Matemáticas',
    tiempo: 'Hace 5 minutos',
    estado: 'pendiente'
  },
  {
    id: 2,
    usuario: 'Juan Pérez',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez',
    mensaje: 'Tutoría de Programación aceptada',
    tiempo: 'Hace 15 minutos',
    estado: 'aceptada'
  },
  {
    id: 3,
    usuario: 'Ana Martínez',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Martínez',
    mensaje: 'Tutoría de Física completada',
    tiempo: 'Hace 1 hora',
    estado: 'completada'
  }
])

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const nuevaSolicitud = () => {
  router.push('/solicitar-tutoria')
}
</script>

<style>
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200;
}
</style>