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
            <!-- Buscador -->
            <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 class="text-2xl font-bold mb-6">Buscar Tutor</h2>
              
              <div class="space-y-4">
                <!-- Barra de búsqueda -->
                <div class="flex gap-4">
                  <div class="flex-1">
                    <input
                      type="text"
                      v-model="busqueda"
                      placeholder="Buscar por nombre o especialidad..."
                      class="w-full rounded-lg border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      @input="buscarTutores"
                    />
                  </div>
                  <button
                    @click="buscarTutores"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Buscar
                  </button>
                </div>
  
                <!-- Filtros -->
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="materia in materias"
                    :key="materia"
                    @click="toggleFiltro(materia)"
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-medium',
                      filtrosActivos.includes(materia)
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-500'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    ]"
                  >
                    {{ materia }}
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Lista de Tutores -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="tutor in tutoresFiltrados"
                :key="tutor.id"
                class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div class="p-6">
                  <div class="flex items-center">
                    <img
                      :src="tutor.avatar"
                      :alt="tutor.nombre"
                      class="h-16 w-16 rounded-full object-cover"
                    />
                    <div class="ml-4">
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ tutor.nombre }}
                      </h3>
                      <p class="text-sm text-gray-500">{{ tutor.especialidad }}</p>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                    <div class="flex items-center">
                      <div class="flex text-yellow-400">
                        <svg v-for="i in 5" :key="i" class="h-5 w-5" :class="i <= tutor.calificacion ? 'text-yellow-400' : 'text-gray-200'" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <p class="ml-2 text-sm text-gray-500">
                        {{ tutor.calificacion }} de 5
                      </p>
                    </div>
                  </div>
  
                  <div class="mt-4">
                    <h4 class="text-sm font-medium text-gray-900">Materias:</h4>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <span
                        v-for="materia in tutor.materias"
                        :key="materia"
                        class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full"
                      >
                        {{ materia }}
                      </span>
                    </div>
                  </div>
  
                  <div class="mt-6">
                    <button
                      @click="seleccionarTutor(tutor)"
                      class="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Solicitar Tutoría
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Estado de carga -->
            <div v-if="isLoading" class="flex justify-center items-center py-12">
              <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Navbar from './Navbar.vue';
  import Sidebar from './Sidebar.vue';
  
  const router = useRouter();
  const isSidebarOpen = ref(false);
  const isLoading = ref(false);
  const busqueda = ref('');
  const filtrosActivos = ref([]);
  
  // Datos de ejemplo
  const materias = ['Matemáticas', 'Física', 'Química', 'Programación', 'Literatura'];
  
  const tutores = ref([
    {
      id: 1,
      nombre: 'Dr. Juan Pérez',
      especialidad: 'Matemáticas',
      materias: ['Matemáticas', 'Física'],
      calificacion: 4.8,
      avatar: 'https://ui-avatars.com/api/?name=Juan+Pérez&background=random'
    },
    {
      id: 2,
      nombre: 'Dra. María García',
      especialidad: 'Programación',
      materias: ['Programación', 'Matemáticas'],
      calificacion: 4.9,
      avatar: 'https://ui-avatars.com/api/?name=María+García&background=random'
    },
    // ... más tutores
  ]);
  
  const tutoresFiltrados = computed(() => {
    return tutores.value.filter(tutor => {
      const coincideBusqueda = !busqueda.value || 
        tutor.nombre.toLowerCase().includes(busqueda.value.toLowerCase()) ||
        tutor.especialidad.toLowerCase().includes(busqueda.value.toLowerCase());
      
      const coincideFiltros = filtrosActivos.value.length === 0 || 
        tutor.materias.some(materia => filtrosActivos.value.includes(materia));
      
      return coincideBusqueda && coincideFiltros;
    });
  });
  
  const toggleFiltro = (materia) => {
    const index = filtrosActivos.value.indexOf(materia);
    if (index === -1) {
      filtrosActivos.value.push(materia);
    } else {
      filtrosActivos.value.splice(index, 1);
    }
  };
  
  const buscarTutores = async () => {
    isLoading.value = true;
    try {
      // Simulación de búsqueda
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      isLoading.value = false;
    }
  };
  
  const seleccionarTutor = (tutor) => {
    router.push({
      path: '/solicitar-tutoria',
      query: { tutorId: tutor.id }
    });
  };
  
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };
  </script>