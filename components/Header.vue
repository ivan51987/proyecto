<template>
    <v-app-bar color="primary" dark app>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none" />
        <v-app-bar-title>Mi empresa</v-app-bar-title>
        <v-spacer />

        <div class="d-none d-md-flex">
            <v-btn text to="/">Inicio</v-btn>
            <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props">
                        Mi empresa
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in itemsEmpresa" :key="i">
                        <router-link :to="item.url" class="no-underline">
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </router-link>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props">
                        Servicio
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in itemsServicios" :key="i">
                        <router-link :to="item.url" class="no-underline">
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </router-link>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-menu transition="slide-y-transition">
                <template v-slot:activator="{ props }">
                    <v-btn v-bind="props">
                        Trabajos Dedicados
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(item, i) in itemsTrabajos" :key="i">
                        <router-link :to="item.url" class="no-underline">
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </router-link>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn text to="/contact">Contacto</v-btn>
        </div>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
        <v-list>

            <v-list-item>
                <router-link to="/" class="no-underline">
                    <v-list-item-title>Inicio</v-list-item-title>
                </router-link>
            </v-list-item>
            <v-list-item @click="menuEmpresa = !menuEmpresa">
                <v-list-item-title>Empresa</v-list-item-title>
            </v-list-item>
            <v-list v-if="menuEmpresa">
                <v-list-item v-for="(item, i) in itemsEmpresa" :key="i">
                    <router-link :to="item.url" class="no-underline">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </router-link>
                </v-list-item>
            </v-list>
            <v-list-item @click="menuServices = !menuServices">
                <v-list-item-title>Servicios</v-list-item-title>
            </v-list-item>
            <v-list v-if="menuServices">
                <v-list-item v-for="(item, i) in itemsServicios" :key="i">
                    <router-link :to="item.url" class="no-underline">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </router-link>
                </v-list-item>
            </v-list>
            <v-list-item @click="menuTrabajo = !menuTrabajo">
                <v-list-item-title>Trabajo Dedicados</v-list-item-title>
            </v-list-item>
            <v-list v-if="menuTrabajo">
                <v-list-item v-for="(item, i) in itemsTrabajos" :key="i">
                    <router-link :to="item.url" class="no-underline">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </router-link>
                </v-list-item>
            </v-list>
            <v-list-item>
                <router-link to="/contact" class="no-underline">
                    <v-list-item-title>Contacto</v-list-item-title>
                </router-link>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue'

const drawer = ref(false)
const menuServices = ref(false)
const menuEmpresa = ref(false)
const menuTrabajo = ref(false)
const itemsServicios = ref([
    { title: 'Cuidado de Adulto Mayor', url: '/services/service1' },
    { title: 'Soporte de Adulto Mayor', url: '/services/service2' }
])

const itemsEmpresa = ref([
    { title: 'Misión', url: '/empresa/mision' },
    { title: 'Visión', url: '/empresa/vision' },
    { title: 'Objetivo', url: '/empresa/objetivo' },
    { title: 'Alcance', url: '/empresa/alcance' }
])

const itemsTrabajos = ref([
    { title: 'Atención Domicilio', url: '/trabajos/trabajo1' },
    { title: 'Cuidado Personalizado', url: '/trabajos/trabajo2' },
    { title: 'Servicio de Enfermería', url: '/trabajos/trabajo3' },
    { title: 'Asistencia a Domicilio', url: '/trabajos/trabajo4' },
    { title: 'Terapias Físicas', url: '/trabajos/trabajo5' },
    { title: 'Apoyo Psicológico', url: '/trabajos/trabajo6' }
])

</script>

<style scoped>
.no-underline {
    text-decoration: none;
    transition: color 0.3s ease, background-color 0.3s ease;
}

.no-underline:hover {
    color: #ff4081;
    background-color: rgba(0, 0, 0, 0.2);
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    transition: color 0.3s ease, background-color 0.3s ease, font-weight 0.3s ease, letter-spacing 0.3s ease;
}


.no-underline:focus {
    outline: none;
    box-shadow: 3px 0 0 2px rgba(63, 81, 181, 0.5);
}
</style>