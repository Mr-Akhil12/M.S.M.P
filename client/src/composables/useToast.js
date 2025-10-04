import { useToast } from 'vue-toastification'

export const useAppToast = () => {
  const toast = useToast()

  const showSuccess = (message) => {
    toast.success(message)
  }

  const showError = (message) => {
    toast.error(message)
  }

  const showInfo = (message) => {
    toast.info(message)
  }

  const showWarning = (message) => {
    toast.warning(message)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}