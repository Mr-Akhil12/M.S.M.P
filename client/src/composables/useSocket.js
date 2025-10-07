import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '../stores/auth'
import { useSubscriptionsStore } from '../stores/subscriptions'

export function useSocket() {
  const authStore = useAuthStore()
  const subscriptionsStore = useSubscriptionsStore()
  const socket = ref(null)
  const isConnected = ref(false)

  const connect = () => {
    if (!authStore.token) return

    socket.value = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token: authStore.token }
    })

    socket.value.on('connect', () => {
      isConnected.value = true
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })

    // Listen for real-time subscription updates
    socket.value.on('subscription:created', () => {
      subscriptionsStore.fetchSubscriptions()
    })

    socket.value.on('subscription:cancelled', () => {
      subscriptionsStore.fetchSubscriptions()
    })
  }

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect()
      socket.value = null
      isConnected.value = false
    }
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    socket,
    isConnected,
    connect,
    disconnect
  }
}