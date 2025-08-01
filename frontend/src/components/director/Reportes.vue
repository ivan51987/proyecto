<template>
    <div class="min-h-screen bg-gray-100">
        <Navbar @toggle-sidebar="toggleSidebar" />
        <Sidebar :is-open="isSidebarOpen" />

        <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
            <div class="px-4 sm:px-6 lg:px-8 py-8">
                <div class="max-w-7xl mx-auto">
                    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div class="p-6">
                            <h2 class="text-2xl font-bold mb-6">Reportes</h2>

                            <!-- Filtros -->
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha inicio</label>
                                    <input v-model="fechaInicio" type="date" class="border rounded px-4 py-2 w-full" />
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha fin</label>
                                    <input v-model="fechaFin" type="date" class="border rounded px-4 py-2 w-full" />
                                </div>
                                <button @click="buscarDatosReporte"
                                    class="bg-blue-500 text-white px-4 py-5 rounded mb-4 hover:bg-blue-600">
                                    Buscar
                                </button>
                            </div>

                            <!-- Botón de exportar -->
                            <button @click="exportarPDF"
                                class="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
                                Exportar PDF
                            </button>

                            <!-- Tabla -->
                            <div class="overflow-x-auto">
                                <table class="min-w-full border border-gray-200 text-left text-sm">
                                    <thead class="bg-gray-100">
                                        <tr>
                                            <th class="px-4 py-2 border">#</th>
                                            <th class="px-4 py-2 border">Participante</th>
                                            <th class="px-4 py-2 border">Nombre del Proyecto de Grado</th>
                                            <th class="px-4 py-2 border">Tutor</th>
                                            <th class="px-4 py-2 border">Tipo</th>
                                            <th class="px-4 py-2 border">Tribunales</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(proyecto, index) in listaProyectos" :key="index"
                                            class="hover:bg-gray-50">
                                            <td class="px-4 py-2 border">{{ index + 1 }}</td>
                                            <td class="px-4 py-2 border">{{ proyecto.estudiante }}</td>
                                            <td class="px-4 py-2 border">{{ proyecto.titulo }}</td>
                                            <td class="px-4 py-2 border">{{ proyecto.tutor }}</td>
                                            <td class="px-4 py-2 border">{{ proyecto.tipotutoria }}</td>
                                            <td class="px-4 py-2 border">
                                                <ul class="list-disc list-inside">
                                                    <li v-for="tribunal in proyecto.tribunales" :key="tribunal.id">
                                                        {{ tribunal.fullName }}
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                        <tr v-if="listaProyectos.length === 0">
                                            <td colspan="4" class="text-center py-4 text-gray-500">No se encontraron
                                                resultados</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
import datosProyectosService from '../../services/directorService';

const isSidebarOpen = ref(false);
const listaProyectos = ref([]);
const fechaInicio = ref('');
const fechaFin = ref('');

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const buscarDatosReporte = async () => {
    try {
        const response = await datosProyectosService.reporteProyecto(fechaInicio.value, fechaFin.value);
        console.log('Datos del reporte:', response);

        listaProyectos.value = response;
    } catch (error) {
        console.error('Error al cargar los proyectos:', error);
    }
};


const exportarPDF = async () => {
    try {
        await datosProyectosService.descargarReportePDF(fechaInicio.value, fechaFin.value);
    } catch (error) {
        console.error('Error al exportar PDF:', error);
    }
};

</script>
