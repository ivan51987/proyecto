<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />
    <Sidebar :is-open="isSidebarOpen" />

    <main
      class="pt-16 transition-all duration-300"
      :class="['md:ml-60', isSidebarOpen ? 'ml-60' : 'ml-0']"
    >
      <div class="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden p-6">
          <h2 class="text-2xl font-bold mb-6">Registro de Conclusión de Defensa</h2>

          <form @submit.prevent="registrarActa" class="space-y-6">
            <!-- Estudiante -->
            <div>
              <label class="block font-semibold mb-1" for="estudiante">Estudiante</label>
              <select
                id="estudiante"
                v-model="form.estudianteId"
                @change="cargarDatosEstudiante"
                class="w-full border rounded px-3 py-2"
              >
                <option value="" disabled>Seleccione un estudiante</option>
                <option v-for="est in estudiantes" :key="est.id" :value="est.id">
                  {{ est.nombre }}
                </option>
              </select>
            </div>

            <!-- Carrera -->
            <div>
              <label class="block font-semibold mb-1">Carrera</label>
              <input
                type="text"
                v-model="form.carrera"
                disabled
                class="w-full border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <!-- Lugar -->
            <div>
              <label class="block font-semibold mb-1" for="lugar">Lugar</label>
              <input
                id="lugar"
                v-model="form.lugar"
                type="text"
                placeholder="Ingrese lugar"
                disabled
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <!-- Tribunales -->
            <fieldset>
              <legend class="font-semibold mb-2">Tribunales</legend>
              <div v-for="(tribunal, i) in form.tribunales" :key="i" class="mb-3">
                <label :for="'tribunal' + i" class="block mb-1">Tribunal {{ i + 1 }}</label>
                <input
                  :id="'tribunal' + i"
                  v-model="tribunal.nombre"
                  type="text"
                  placeholder="Nombre del tribunal"
                  disabled
                  class="w-full border rounded px-3 py-2"
                />
              </div>
            </fieldset>

            <!-- Título -->
            <div>
              <label class="block font-semibold mb-1" for="titulo">Título del Proyecto</label>
              <input
                id="titulo"
                v-model="form.titulo"
                type="text"
                placeholder="Título registrado anteriormente"
                disabled
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <!-- Fecha -->
            <div>
              <label class="block font-semibold mb-1" for="fecha">Fecha</label>
              <input
                id="fecha"
                v-model="form.fecha"
                type="date"
                disabled
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <!-- Hora -->
            <div>
              <label class="block font-semibold mb-1" for="hora">Hora</label>
              <input
                id="hora"
                v-model="form.hora"
                type="time"
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <!-- Preguntas Correctas e Incorrectas -->
            <div class="flex space-x-4">
              <div class="flex-1">
                <label class="block font-semibold mb-1" for="preguntasCorrectas">Preguntas Correctas</label>
                <input
                  id="preguntasCorrectas"
                  v-model.number="form.preguntasCorrectas"
                  type="number"
                  min="0"
                  class="w-full border rounded px-3 py-2"
                />
              </div>
              <div class="flex-1">
                <label class="block font-semibold mb-1" for="preguntasIncorrectas">Preguntas Incorrectas</label>
                <input
                  id="preguntasIncorrectas"
                  v-model.number="form.preguntasIncorrectas"
                  type="number"
                  min="0"
                  class="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <!-- Nota -->
            <div>
              <label class="block font-semibold mb-1" for="nota">Nota Final</label>
              <input
                id="nota"
                v-model.number="form.nota"
                type="number"
                min="0"
                max="100"
                step="0.1"
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <!-- Observaciones -->
            <div>
              <label class="block font-semibold mb-1" for="observaciones">Observaciones</label>
              <textarea
                id="observaciones"
                v-model="form.observaciones"
                rows="4"
                class="w-full border rounded px-3 py-2"
                placeholder="Observaciones..."
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex space-x-4">
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Registrar Acta
              </button>
              <button
                type="button"
                @click="imprimirActa"
                class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
              >
                Imprimir Acta
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import Navbar from '../Navbar.vue';
import Sidebar from '../Sidebar.vue';

const isSidebarOpen = ref(false);
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
}

// Datos simulados con info extra según estudiante
const estudiantes = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    carrera: 'Ingeniería de Sistemas',
    lugar: 'Auditorio A',
    fecha: '2025-07-15',  // fecha agregada
    hora: '',  // igual
    tribunales: ['Dr. Gómez', 'Dra. Martínez', 'Ing. López'],
    titulo: 'Sistema de Gestión de Inventarios',
  },
  {
    id: 2,
    nombre: 'María Gómez',
    carrera: 'Arquitectura',
    lugar: 'Sala 101',
    fecha: '2025-07-20',  // fecha agregada
    hora: '',
    tribunales: ['Arq. Fernández', 'Arq. Ramírez', 'Arq. Torres'],
    titulo: 'Diseño de Espacios Urbanos Sustentables',
  },
  {
    id: 3,
    nombre: 'Luis Martínez',
    carrera: 'Derecho',
    lugar: 'Sala de Juicios',
    fecha: '2025-07-25',  // fecha agregada
    hora: '',
    tribunales: ['Lic. Sánchez', 'Lic. Pérez', 'Lic. Ruiz'],
    titulo: 'Análisis Jurídico de Contratos Civiles',
  },
]);


const form = ref({
  estudianteId: '',
  carrera: '',
  lugar: '',
  fecha: '',
  hora: '',
  tribunales: [
    { nombre: '' },
    { nombre: '' },
    { nombre: '' },
  ],
  titulo: '',
  preguntasCorrectas: 0,
  preguntasIncorrectas: 0,
  nota: null,
  observaciones: '',
});

function cargarDatosEstudiante() {
  const est = estudiantes.value.find(e => e.id === form.value.estudianteId);
  if (est) {
    form.value.carrera = est.carrera || '';
    form.value.lugar = est.lugar || '';
    form.value.titulo = est.titulo || '';
    // Cargar tribunales
    form.value.tribunales = est.tribunales.map(nombre => ({ nombre })) || [
      { nombre: '' },
      { nombre: '' },
      { nombre: '' },
    ];

    // Estos quedan vacíos para que el usuario los llene
    form.value.fecha = est.fecha || '';
    form.value.hora = '';
    form.value.preguntasCorrectas = 0;
    form.value.preguntasIncorrectas = 0;
    form.value.nota = null;
    form.value.observaciones = '';
  } else {
    // Limpiar si no hay selección
    form.value.carrera = '';
    form.value.lugar = '';
    form.value.titulo = '';
    form.value.tribunales = [
      { nombre: '' },
      { nombre: '' },
      { nombre: '' },
    ];
    form.value.fecha = '';
    form.value.hora = '';
    form.value.preguntasCorrectas = 0;
    form.value.preguntasIncorrectas = 0;
    form.value.nota = null;
    form.value.observaciones = '';
  }
}

function registrarActa() {
  // Aquí puedes hacer la llamada a la API para guardar la información
  console.log('Acta registrada:', form.value);
  alert('Acta registrada correctamente!');
}

function imprimirActa() {
  const actaHTML = `
    <html>
    <head><title>Acta de Defensa</title></head>
    <body>
      <h1>Acta de Defensa</h1>
      <p><strong>Estudiante:</strong> ${
        estudiantes.value.find((e) => e.id === form.value.estudianteId)?.nombre || ''
      }</p>
      <p><strong>Carrera:</strong> ${form.value.carrera}</p>
      <p><strong>Lugar:</strong> ${form.value.lugar}</p>
      <p><strong>Fecha:</strong> ${form.value.fecha}</p>
      <p><strong>Hora:</strong> ${form.value.hora}</p>
      <p><strong>Tribunales:</strong></p>
      <ul>
        ${form.value.tribunales.map((t) => `<li>${t.nombre}</li>`).join('')}
      </ul>
      <p><strong>Título:</strong> ${form.value.titulo}</p>
      <p><strong>Preguntas Correctas:</strong> ${form.value.preguntasCorrectas}</p>
      <p><strong>Preguntas Incorrectas:</strong> ${form.value.preguntasIncorrectas}</p>
      <p><strong>Nota Final:</strong> ${form.value.nota}</p>
      <p><strong>Observaciones:</strong> ${form.value.observaciones}</p>
      <button onclick="window.print()">Imprimir</button>
    </body>
    </html>
  `;
  const w = window.open();
  w.document.write(actaHTML);
  w.document.close();
}
</script>

