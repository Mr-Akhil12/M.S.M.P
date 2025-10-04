// filepath: client/src/stores/subscriptions.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useSubscriptionsStore = defineStore('subscriptions', () => {
  const subscriptions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchSubscriptions = async () => {
    console.log('🔄 fetchSubscriptions called')
    loading.value = true
    error.value = null
    try {
      console.log('📡 Calling /subscriptions API')
      const response = await api.get('/subscriptions')
      console.log('✅ API response received:', response.data)
      // Filter out subscriptions with null serviceId
      subscriptions.value = response.data.filter(sub => sub.serviceId)
      console.log('📝 Subscriptions set (filtered):', subscriptions.value, 'Length:', subscriptions.value.length)
    } catch (err) {
      console.error('❌ Fetch error:', err)
      error.value = err.response?.data?.message || 'Failed to fetch subscriptions'
    } finally {
      console.log('🏁 Setting loading to false')
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
      console.error('Subscribe error:', err)
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
      console.error('Unsubscribe error:', err)
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  return { subscriptions, loading, error, fetchSubscriptions, subscribe, unsubscribe }
})