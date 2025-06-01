export const tutoriaService = {
    async registrarSolicitud(estudianteId, motivo) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            estudianteId,
            motivo,
            fecha: new Date(),
            estado: 'pendiente'
          })
        }, 500)
      })
    },
  
    async listarSolicitudesPendientes() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              estudiante: 'Juan Pérez',
              motivo: 'Necesito ayuda con Vue.js',
              fecha: new Date(),
              estado: 'pendiente'
            },
          ])
        }, 500)
      })
    },
  
    async actualizarEstadoSolicitud(solicitudId, decision) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            mensaje: `Solicitud ${decision === 'aceptada' ? 'aceptada' : 'rechazada'} correctamente`
          })
        }, 500)
      })
    }
  }