<template>
  <component :is="componentePorRol" />
</template>

<script setup>
import PanelEstudiante from './panel/PanelEstudiante.vue'
import PanelDirector from './panel/PanelDirector.vue'
import PanelDocente from './panel/PanelDocente.vue'
import PanelSecretaria from './panel/PanelSecretaria.vue'

// Obtener y parsear el usuario desde localStorage
const user = JSON.parse(localStorage.getItem('user'))
const userRole = user?.role || 'estudiante'
console.log(`Rol del usuario: ${userRole}`)

// Asignar componente según el rol
const componentePorRol = {
  estudiante: PanelEstudiante,
  director: PanelDirector,
  docente: PanelDocente,
  secretaria: PanelSecretaria
}[userRole] || PanelEstudiante
</script>
