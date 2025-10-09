import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import router from '../router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000 // 10 second timeout
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    console.error('🔴 [API] Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ [API] Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    })
    return response
  },
  (error) => {
    console.error('❌ [API] Response Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    })

    // More specific error messages
    if (error.code === 'ECONNABORTED') {
      console.error('❌ [API] Request timeout')
    } else if (error.code === 'ERR_NETWORK') {
      console.error('❌ [API] Network error - backend might be down')
    } else if (!error.response) {
      console.error('❌ [API] No response from server')
    }

    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/')
    }
    return Promise.reject(error)
  }
)

export default api