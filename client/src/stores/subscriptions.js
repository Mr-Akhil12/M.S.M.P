import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const subscriptions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSubscriptions = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/subscriptions')
      
      // Filter for active subscriptions only
      subscriptions.value = response.data.filter(sub => 
        sub.serviceId && sub.status === 'active'
      )
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch subscriptions'
    } finally {
      loading.value = false
    }
  }

  const subscribe = async (serviceId) => {
    loading.value = true
    error.value = null
    try {
      await api.post('/subscriptions', { serviceId })
      await fetchSubscriptions()
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to subscribe'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  const unsubscribe = async (serviceId) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/subscriptions/${serviceId}`)
      await fetchSubscriptions()
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to unsubscribe'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  return { subscriptions, loading, error, fetchSubscriptions, subscribe, unsubscribe }
})