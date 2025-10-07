<template>
  <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading transactions...</p>
    </div>

    <!-- Transactions Table -->
    <div v-else-if="transactions.length > 0" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Service
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="transaction in transactions" :key="transaction._id" class="hover:bg-gray-50 dark:hover:bg-gray-800">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ formatDate(transaction.date) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
              {{ transaction.serviceId?.name || 'Unknown Service' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                :class="getTypeClass(transaction.type)"
              >
                {{ transaction.type }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                :class="transaction.type === 'subscription' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
              {{ transaction.type === 'subscription' ? '-' : '+' }}R{{ transaction.amount }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusClass(transaction.status)"
              >
                {{ transaction.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No transactions</h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Your transaction history will appear here.</p>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Error loading transactions</h3>
      <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      <button
        @click="fetchTransactions"
        class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import api from '../services/api'
import { useSocket } from '../composables/useSocket'

const { socket, isConnected } = useSocket()
const transactions = ref([])
const loading = ref(false)
const error = ref('')

const fetchTransactions = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/transactions')
    transactions.value = response.data.transactions || []
    console.log('✅ Transactions loaded:', transactions.value.length)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load transactions'
    console.error('❌ Transaction fetch error:', err)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTypeClass = (type) => {
  return type === 'subscription'
    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
}

const getStatusClass = (status) => {
  return status === 'success'
    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
}

// Socket.IO event listeners
const setupSocketListeners = () => {
  if (!socket.value) {
    console.log('⚠️ Socket not available for transaction listeners')
    return
  }

  console.log('🔌 Setting up transaction socket listeners')

  // Listen for new transactions
  socket.value.on('transaction:created', (data) => {
    console.log('💰 Transaction created event received:', data)
    fetchTransactions()
  })

  // Also listen to subscription events as backup
  socket.value.on('subscription:created', (data) => {
    console.log('🔄 Subscription created - refreshing transactions')
    fetchTransactions()
  })

  socket.value.on('subscription:cancelled', (data) => {
    console.log('🔄 Subscription cancelled - refreshing transactions')
    fetchTransactions()
  })
}

const cleanupSocketListeners = () => {
  if (!socket.value) return

  console.log('🧹 Cleaning up transaction socket listeners')
  socket.value.off('transaction:created')
  socket.value.off('subscription:created')
  socket.value.off('subscription:cancelled')
}

// Watch for socket connection changes
watch(socket, (newSocket) => {
  if (newSocket) {
    console.log('✅ Socket connected in TransactionList')
    setupSocketListeners()
  }
}, { immediate: true })

onMounted(() => {
  console.log('📊 TransactionList mounted')
  fetchTransactions()
  
  // Setup listeners if socket already exists
  if (socket.value) {
    setupSocketListeners()
  }
})

onUnmounted(() => {
  console.log('👋 TransactionList unmounting')
  cleanupSocketListeners()
})

// Expose fetchTransactions so parent can call it
defineExpose({
  fetchTransactions
})
</script>