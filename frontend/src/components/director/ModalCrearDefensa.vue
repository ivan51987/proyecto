<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 class="text-xl font-semibold mb-6 text-center">Registrar Nueva Defensa</h3>

      <div class="mb-4">
        <label for="fecha" class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input
          id="fecha"
          v-model="selectedFecha"
          type="date"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
          required
        />
      </div>

      <div class="mb-4">
        <label for="hora" class="block text-sm font-medium text-gray-700 mb-1">Hora (HH:MM)</label>
        <input
          id="hora"
          v-model="newEventTime"
          type="time"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
          required
        />
      </div>
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Estudiante</label>
        <input
          :value="proyecto?.estudiante.nombre || ''"
          class="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
          readonly
        />
      </div>

      <div class="mb-4">
        <label for="lugar-select" class="block text-sm font-medium text-gray-700 mb-1">Lugar</label>
        <select
          id="lugar-select"
          v-model="selectedLugar"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
          required
        >
          <option disabled value="">Seleccione un lugar</option>
          <option>Salón de conferencia(Ciudadania Universitaria)</option>
          <option>Salón dorado(Edificio 3 de Julio)</option>
          <option>Otro</option>
        </select>
      </div>

      <div v-if="selectedLugar === 'Otro'" class="mb-4">
        <label for="otro-lugar" class="block text-sm font-medium text-gray-700 mb-1">Especifique el lugar</label>
        <input
          id="otro-lugar"
          v-model="otroLugar"
          class="w-full border border-gray-300 rounded px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
          placeholder="Ej. Aula B-201"
          required
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">Tema</label>
        <input
          :value="proyecto?.titulo || ''"
          class="w-full border rounded px-3 py-2 bg-gray-100 text-gray-700"
          readonly
        />
      </div>

      <div class="text-right mt-6 space-x-2">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          @click="registrar"
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  proyecto: {
    type: Object,
    required: true,
  },
  fecha: {
    type: String,
    required: false,
    default: '',
  },
});

const emit = defineEmits(['close', 'registrar']);

const selectedFecha = ref(props.fecha || '');
const newEventTime = ref('');
const selectedLugar = ref('');
const otroLugar = ref('');

const registrar = () => {
  const lugarFinal = selectedLugar.value === 'Otro' ? otroLugar.value.trim() : selectedLugar.value;

  if (!selectedFecha.value || !newEventTime.value.trim() || !lugarFinal) {
    alert('Por favor, completa todos los campos obligatorios.');
    return;
  }
    
  const defensa = {
    proyectoId: props.proyecto.proyecto_id,
    fechaDefensa: selectedFecha.value,
    horaDefensa: newEventTime.value,
    lugarDefensa: lugarFinal,
    estudianteId: props.proyecto.estudiante_id,
    tribunal1Id: props.proyecto.docente_1_id,
    tribunal2Id: props.proyecto.docente_2_id,
    tribunal3Id: props.proyecto.docente_3_id,
    tutorId: props.proyecto.tutor_id,
    tipoTutoria: props.proyecto.tipotutoria,
  };

  emit('registrar', defensa);
  emit('close');
};
</script>
