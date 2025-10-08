<template>
  <!-- Container centered by App.vue main -->
  <section class="w-full items-center justify-center px-4 py-16 sm:px-6 lg:px-8 min-h-screen min-w-screen flex">
    <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Dashboard</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Welcome back, {{ authStore.user?.msisdn }}</p>
        <!-- Connection Status Indicator (Optional) -->
        <span class="text-xs" :class="isConnected ? 'text-green-600' : 'text-red-600'">
          {{ isConnected ? '🟢 Connected' : '🔴 Disconnected' }}
        </span>
      </div>

      <!-- Error Banner -->
      <div v-if="globalError" class="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm text-red-600 dark:text-red-200">{{ globalError }}</p>
      </div>

      <!-- Available Services Section -->
      <section class="mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">Available Services</h2>
          <button
            @click="refreshServices"
            :disabled="servicesStore.loading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition"
          >
            <svg class="w-4 h-4 mr-2" :class="{ 'animate-spin': servicesStore.loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <!-- Services Grid -->
        <div v-if="servicesStore.services.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ServiceCard
            v-for="service in servicesStore.services"
            :key="service._id"
            :service="service"
            :is-subscribed="isSubscribed(service._id)"
            @subscribe="handleSubscribe"
            class="transform transition-all duration-300 hover:scale-105"
          />
        </div>

        <!-- Loading State -->
        <div v-else-if="servicesStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="n in 6" :key="n" class="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
            <div class="w-full h-32 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
            <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No services available</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Services will appear here once they're added.</p>
        </div>
      </section>

      <!-- Active Subscriptions Section -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Active Subscriptions</h2>
        <div v-if="subscriptionsStore.subscriptions.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <SubscriptionCard
            v-for="subscription in subscriptionsStore.subscriptions"
            :key="subscription._id"
            :subscription="subscription"
            @unsubscribe="handleUnsubscribe"
            class="transform transition-all duration-300 hover:shadow-lg"
          />
        </div>

        <!-- Loading State -->
        <div v-else-if="subscriptionsStore.loading" class="space-y-4">
          <div v-for="n in 3" :key="n" class="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 animate-pulse">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mb-2"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-4"></div>
                <div class="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
              <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No active subscriptions</h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Subscribe to services above to see them here.</p>
        </div>
      </section>

      <!-- Transaction History Section -->
      <section class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Transaction History</h2>
        <TransactionList ref="transactionListRef" class="transform transition-all duration-300" />
      </section>

      <!-- Logout Button -->
      <div class="text-center">
        <button
          @click="$router.push('/admin')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Admin Dashboard
        </button>
        <button
          @click="handleLogout"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useServicesStore } from '../stores/services'
import { useSubscriptionsStore } from '../stores/subscriptions'
import ServiceCard from '../components/ServiceCard.vue'
import SubscriptionCard from '../components/SubscriptionCard.vue'
import TransactionList from '../components/TransactionList.vue'
import { useAppToast } from '../composables/useToast'
import { useSocket } from '../composables/useSocket'

const router = useRouter()
const authStore = useAuthStore()
const servicesStore = useServicesStore()
const subscriptionsStore = useSubscriptionsStore()
const { showSuccess, showError, showInfo } = useAppToast()
const { socket, isConnected } = useSocket()

const globalError = ref('')
const transactionListRef = ref(null)

// Check if user is subscribed to a service
const isSubscribed = (serviceId) => {
  return subscriptionsStore.subscriptions.some(sub => sub.serviceId && sub.serviceId._id === serviceId)
}

// Handle subscribe action
const handleSubscribe = async (serviceId) => {
  try {
    const result = await subscriptionsStore.subscribe(serviceId)
    if (!result.success) {
      showError(result.message)
    } else {
      showSuccess('Successfully subscribed!')
    }
  } catch (error) {
    showError('Failed to subscribe. Please try again.')
  }
}

// Handle unsubscribe action
const handleUnsubscribe = async (serviceId) => {
  if (!confirm('Are you sure you want to unsubscribe from this service?')) {
    return
  }

  try {
    const result = await subscriptionsStore.unsubscribe(serviceId)
    if (!result.success) {
      showError(result.message)
    } else {
      showSuccess('Successfully unsubscribed!')
    }
  } catch (error) {
    showError('Failed to unsubscribe. Please try again.')
  }
}

// Refresh services
const refreshServices = async () => {
  await servicesStore.fetchServices()
}

// Handle logout
const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    authStore.logout()
    showInfo('You have been logged out')
    router.push('/')
  }
}

// Load data on mount
onMounted(async () => {
  await Promise.all([
    servicesStore.fetchServices(),
    subscriptionsStore.fetchSubscriptions()
  ])

  // Real-time updates via Socket.IO
  if (socket.value) {
    socket.value.on('subscription:created', () => {
      subscriptionsStore.fetchSubscriptions()
      if (transactionListRef.value?.fetchTransactions) {
        transactionListRef.value.fetchTransactions()
      }
    })

    socket.value.on('subscription:cancelled', () => {
      subscriptionsStore.fetchSubscriptions()
      if (transactionListRef.value?.fetchTransactions) {
        transactionListRef.value.fetchTransactions()
      }
    })
  }
})
</script>