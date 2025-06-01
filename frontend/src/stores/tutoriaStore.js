import { defineStore } from 'pinia'
import { tutoriaService } from '../services/tutoriaService'

export const useTutoriaStore = defineStore('tutoria', {
  state: () => ({
    solicitudes: [],
    loading: false,
    error: null
  }),

  actions: {
    async registrarSolicitud(estudianteId, motivo) {
      try {
        this.loading = true
        const resultado = await tutoriaService.registrarSolicitud(estudianteId, motivo)
        this.solicitudes.push(resultado)
        return resultado
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async cargarSolicitudesPendientes() {
      try {
        this.loading = true
        const solicitudes = await tutoriaService.listarSolicitudesPendientes()
        this.solicitudes = solicitudes
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async actualizarEstadoSolicitud(solicitudId, decision) {
      try {
        this.loading = true
        await tutoriaService.actualizarEstadoSolicitud(solicitudId, decision)
        const solicitud = this.solicitudes.find(s => s.id === solicitudId)
        if (solicitud) {
          solicitud.estado = decision
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})