<template>
  <!-- Container centered by App.vue main -->
  <section class="w-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8 min-h-screen flex">
    <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md">
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Welcome</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Mobile Subscription Portal</p>
      </div>

      <form @submit.prevent="sendOTP" class="space-y-4">
        <div>
          <label for="msisdn" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enter your South African mobile number
          </label>
          <input
            id="msisdn"
            v-model="msisdn"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            placeholder="27812345678"
            maxlength="11"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            :class="{ 'border-red-500': error }"
            :disabled="loading"
            required
            autofocus
          />
          <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <button
          type="submit"
          :disabled="loading || !msisdn"
          class="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ loading ? 'Sending OTP...' : 'Send OTP' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-xs text-gray-500 dark:text-gray-400">
          By continuing, you agree to our terms of service.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const msisdn = ref('')
const loading = ref(false)
const error = ref('')

const isValidMSISDN = computed(() => /^27\d{9}$/.test(msisdn.value))

const sendOTP = async () => {
  error.value = ''
  if (!isValidMSISDN.value) {
    error.value = 'Please enter a valid South African mobile number (e.g., 27812345678)'
    return
  }
  loading.value = true
  try {
    await api.post('/auth/send-otp', { msisdn: msisdn.value })
    localStorage.setItem('tempMsisdn', msisdn.value)
    router.push('/verify-otp')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send OTP. Please try again.'
    console.error('Send OTP error:', err)
  } finally {
    loading.value = false
  }
}
</script>