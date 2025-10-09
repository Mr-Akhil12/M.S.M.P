import { ref } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '../stores/auth'

// Singleton socket instance (shared across all components)
let socketInstance = null
let isConnected = ref(false)

export function useSocket() {
  const authStore = useAuthStore()

  // Return existing socket if already connected
  if (socketInstance && socketInstance.connected) {
    console.log('🔌 [Socket] Reusing existing connection')
    return {
      socket: ref(socketInstance),
      isConnected
    }
  }

  // Create new socket connection
  if (!socketInstance) {
    // Determine Socket.IO URL based on environment
    const socketUrl = import.meta.env.PROD 
      ? 'https://m-s-m-p.onrender.com'  // Production
      : 'http://localhost:5000'         // Local/Docker

    console.log('🔌 [Socket] Creating new connection to:', socketUrl)

    socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: authStore.token
      }
    })

    socketInstance.on('connect', () => {
      console.log('✅ [Socket] Connected:', socketInstance.id)
      isConnected.value = true
    })

    socketInstance.on('authenticated', (data) => {
      console.log('🔐 [Socket] Authenticated as user:', data.userId)
    })

    socketInstance.on('authentication_error', (data) => {
      console.error('❌ [Socket] Authentication failed:', data.message)
    })

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ [Socket] Disconnected:', reason)
      isConnected.value = false
    })

    socketInstance.on('connect_error', (error) => {
      console.error('❌ [Socket] Connection error:', error.message)
      isConnected.value = false
    })

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔄 [Socket] Reconnected after', attemptNumber, 'attempts')
      isConnected.value = true
    })
  }

  return {
    socket: ref(socketInstance),
    isConnected
  }
}

// Cleanup function (call on logout)
export function disconnectSocket() {
  if (socketInstance) {
    console.log('🔌 [Socket] Disconnecting...')
    socketInstance.disconnect()
    socketInstance = null
    isConnected.value = false
  }
}