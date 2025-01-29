<template>
    <v-app>
        <Header />
        <v-main>
            <NuxtPage />
        </v-main>
        <Footer />
    </v-app>
</template>

<script setup>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
</script>

<style scoped>
@media (max-width: 600px) {
    v-app {
        display: flex;
        flex-direction: column;
    }
}
</style>
