import Swal from 'sweetalert2'

export function alertaExito(mensaje) {
  Swal.fire({
    icon: 'success',
    title: 'Éxito',
    text: mensaje,
    confirmButtonColor: '#16a34a'
  })
}

export function alertaError(mensaje) {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje,
    confirmButtonColor: '#dc2626',
  })
}

export function alertaConfirmacion({ title, text, confirmText, cancelText} = {}) {
  return Swal.fire({
    title,
    text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#2563eb', 
    cancelButtonColor: '#6b7280',  
  })
}
