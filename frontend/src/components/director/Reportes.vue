<template>
    <div class="min-h-screen bg-gray-100">
        < <div class="min-h-screen bg-gray-100">
            <Navbar @toggle-sidebar="toggleSidebar" />
            <Sidebar :is-open="isSidebarOpen" />

            <!-- Main -->
            <main class="pt-16 transition-all duration-300" :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']">
                <div class="px-4 sm:px-6 lg:px-8 py-8">
                    <div class="max-w-7xl mx-auto">
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div class="p-6">
                                <h2 class="text-2xl font-bold mb-6">Reportes</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';
</script>