import { defineStore } from 'pinia';

export const useTutorStore = defineStore('tutor', {
  state: () => ({
    tutorSeleccionado: null,
  }),
  persist: true, 
});
