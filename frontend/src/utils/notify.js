import Swal from 'sweetalert2'

const darkTheme = Swal.mixin({
  background: '#280905',
  color: '#F0E3E0',
  confirmButtonColor: '#C3110C',
  cancelButtonColor: '#1A0604',
  customClass: {
    popup: 'rounded-xl border border-accent/10 shadow-2xl shadow-red-900/20',
    confirmButton: 'px-6 py-2.5 text-sm font-medium rounded-lg focus:ring-0 hover:opacity-90',
    cancelButton: 'px-6 py-2.5 text-sm font-medium rounded-lg border border-muted/20 focus:ring-0 hover:opacity-90',
    title: 'text-lg font-semibold',
    htmlContainer: 'text-sm text-muted',
  },
  buttonsStyling: true,
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster',
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster',
  },
  timer: 2500,
  timerProgressBar: true,
})

export function showSuccess(message, title = 'Berhasil') {
  return darkTheme.fire({
    icon: 'success',
    title,
    text: message,
  })
}

export function showError(message, title = 'Gagal') {
  return darkTheme.fire({
    icon: 'error',
    title,
    text: message,
    timer: 3000,
  })
}

export function showInfo(message, title = 'Info') {
  return darkTheme.fire({
    icon: 'info',
    title,
    text: message,
  })
}

export function showWarning(message, title = 'Peringatan') {
  return darkTheme.fire({
    icon: 'warning',
    title,
    text: message,
  })
}

export function showConfirm(message, title = 'Konfirmasi') {
  return darkTheme.fire({
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Batal',
    timer: 0,
    timerProgressBar: false,
    reverseButtons: true,
  })
}

export function showLoading(message = 'Memproses...') {
  return darkTheme.fire({
    title: message,
    allowOutsideClick: false,
    showConfirmButton: false,
    timer: 0,
    timerProgressBar: false,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}

export function closeSwal() {
  Swal.close()
}
