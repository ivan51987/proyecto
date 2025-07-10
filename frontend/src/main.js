import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import piniaPersistedState from 'pinia-plugin-persistedstate';
const pinia = createPinia();
pinia.use(piniaPersistedState);

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')