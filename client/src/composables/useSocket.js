import { ref, onMounted, onUnmounted } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '../stores/auth'

let socket = ref(null)
let isConnected = ref(false)

export function useSocket() {
  const authStore = useAuthStore()

  onMounted(() => {
    // Determine Socket.IO URL based on environment
    const socketUrl = import.meta.env.PROD 
      ? 'https://m-s-m-p.onrender.com'  // Production
      : 'http://localhost:5000'         // Local/Docker

    console.log('🔌 [Socket] Connecting to:', socketUrl)

    socket.value = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: authStore.token
      }
    })

    socket.value.on('connect', () => {
      console.log('✅ [Socket] Connected:', socket.value.id)
      isConnected.value = true
    })

    socket.value.on('disconnect', () => {
      console.log('❌ [Socket] Disconnected')
      isConnected.value = false
    })

    socket.value.on('connect_error', (error) => {
      console.error('❌ [Socket] Connection error:', error)
      isConnected.value = false
    })
  })

  onUnmounted(() => {
    if (socket.value) {
      console.log('🔌 [Socket] Disconnecting...')
      socket.value.disconnect()
    }
  })

  return {
    socket,
    isConnected
  }
}