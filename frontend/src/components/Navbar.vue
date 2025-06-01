<template>
  <nav class="bg-white shadow-sm fixed w-full z-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Botón de menú móvil -->
          <button @click="$emit('toggle-sidebar')" class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none">
            <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="ml-4 flex items-center">
            <h1 class="text-xl font-bold text-primary-700">
              <span class="text-primary-500">Mi</span> Aplicación
            </h1>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- Notificaciones -->
          <div class="relative">
            <button @click="toggleNotifications" class="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <span v-if="unreadNotifications" class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            <!-- Panel de notificaciones -->
            <div v-if="showNotifications" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900">Notificaciones</h3>
                <div class="mt-4 space-y-4" v-if="notifications.length">
                  <div v-for="notification in notifications" :key="notification.id" class="flex items-start">
                    <div class="flex-shrink-0">
                      <span :class="[
                        'inline-block h-2 w-2 rounded-full',
                        notification.read ? 'bg-gray-300' : 'bg-primary-500'
                      ]"></span>
                    </div>
                    <div class="ml-3 flex-1">
                      <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                      <p class="mt-1 text-sm text-gray-500">{{ notification.message }}</p>
                      <p class="mt-1 text-xs text-gray-400">{{ notification.time }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4 text-gray-500">
                  No hay notificaciones nuevas
                </div>
              </div>
            </div>
          </div>

          <!-- Perfil -->
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-3 focus:outline-none">
              <span class="hidden md:block text-sm font-medium text-gray-700">{{ userName }}</span>
              <img class="h-8 w-8 rounded-full" :src="userAvatar" :alt="userName" />
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Menú de usuario -->
            <div v-if="showUserMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div class="py-1">
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="navigateToProfile">
                  Mi Perfil
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" @click="navigateToSettings">
                  Configuración
                </a>
                <div class="border-t border-gray-100"></div>
                <a href="#" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100" @click="handleLogout">
                  Cerrar Sesión
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from "../stores/useAuthStore"

const router = useRouter()
const authStore = useAuthStore()

const emit = defineEmits(['toggle-sidebar'])

// Estado
const showNotifications = ref(false)
const showUserMenu = ref(false)
const notifications = ref([
  {
    id: 1,
    title: 'Nueva actualización',
    message: 'Se ha publicado una nueva versión del sistema',
    time: 'Hace 5 minutos',
    read: false
  },
  {
    id: 2,
    title: 'Recordatorio',
    message: 'Reunión de equipo mañana a las 10:00 AM',
    time: 'Hace 1 hora',
    read: true
  }
])

// Datos del usuario
const userName = authStore.user.username
const userAvatar = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=random`
})

// Notificaciones no leídas
const unreadNotifications = computed(() => {
  return notifications.value.some(notification => !notification.read)
})

// Métodos
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const navigateToProfile = () => {
  router.push('/perfil')
  showUserMenu.value = false
}

const navigateToSettings = () => {
  router.push('/configuracion')
  showUserMenu.value = false
}

const handleLogout = () => {
  // Aquí iría la lógica de cierre de sesión
  router.push('/login')
}

// Cerrar menús al hacer clic fuera
const closeMenus = (event) => {
  if (!event.target.closest('.relative')) {
    showNotifications.value = false
    showUserMenu.value = false
  }
}

// Agregar event listener para cerrar menús
onMounted(() => {
  document.addEventListener('click', closeMenus)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenus)
})
</script>