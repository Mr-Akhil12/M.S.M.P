// filepath: client/src/stores/services.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchServices = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/services')
      services.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch services'
      console.error('Fetch services error:', err)
    } finally {
      loading.value = false
    }
  }

  return { services, loading, error, fetchServices }
})