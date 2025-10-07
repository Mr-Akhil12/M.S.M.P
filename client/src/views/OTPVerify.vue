<template>
  <section class="w-full items-center justify-center px-4 py-4 sm:px-6 lg:px-8 min-h-screen flex">
    <div class="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Verify OTP</h1>
        <p class="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Enter the 6-digit code sent to</p>
        <p class="font-semibold text-gray-800 dark:text-gray-100 mt-1 text-sm sm:text-base">{{ maskedMsisdn }}</p>
      </div>

      <!-- OTP Input -->
      <form @submit.prevent="handleVerifyOTP">
        <div class="mb-6">
          <label for="otp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            One-Time Password
          </label>
          <input
            id="otp"
            v-model="otp"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            placeholder="000000"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-xl sm:text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            :class="{ 'border-red-500': error }"
            :disabled="loading"
            required
            autofocus
          />
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">Code expires in {{ formatTime(timeRemaining) }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-600 dark:text-red-200">{{ error }}</p>
        </div>

        <!-- Success Message -->
        <div v-if="success" class="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p class="text-sm text-green-600 dark:text-green-200">✓ Verification successful! Redirecting...</p>
        </div>

        <!-- Verify Button -->
        <button
          type="submit"
          :disabled="loading || otp.length !== 6 || success"
          class="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition mb-4"
        >
          <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ loading ? 'Verifying...' : 'Verify OTP' }}
        </button>

        <!-- Resend OTP -->
        <div class="text-center">
          <button
            type="button"
            @click="handleResendOTP"
            :disabled="resendDisabled || loading"
            class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 disabled:text-gray-400 disabled:cursor-not-allowed transition"
          >
            {{ resendDisabled ? `Resend code in ${resendCountdown}s` : 'Resend OTP' }}
          </button>
        </div>
      </form>

      <!-- Back to Landing -->
      <div class="mt-6 text-center">
        <button
          @click="$router.push('/')"
          class="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          ← Back to login
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useAppToast } from '../composables/useToast'
import api from '../services/api'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError } = useAppToast()

const otp = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const timeRemaining = ref(300) // 5 minutes
const resendDisabled = ref(false)
const resendCountdown = ref(0)

let countdownInterval = null
let resendInterval = null

const msisdn = localStorage.getItem('tempMsisdn') || ''

const maskedMsisdn = computed(() => {
  if (!msisdn) return 'your number'
  return msisdn.substring(0, 3) + '****' + msisdn.substring(msisdn.length - 4)
})

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      clearInterval(countdownInterval)
      error.value = 'OTP expired. Please request a new code.'
    }
  }, 1000)
}

const handleVerifyOTP = async () => {
  if (!msisdn) {
    error.value = 'Session expired. Please start again.'
    router.push('/')
    return
  }

  if (otp.value.length !== 6) {
    error.value = 'Please enter a 6-digit OTP'
    return
  }

  error.value = ''
  loading.value = true

  try {
    const response = await api.post('/auth/verify-otp', {
      msisdn: msisdn,
      otp: otp.value
    })

    success.value = true
    authStore.login(response.data.token, response.data.user)
    localStorage.removeItem('tempMsisdn')
    
    showSuccess('Successfully signed in!')

    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  } catch (err) {
    if (err.response?.status === 400) {
      error.value = err.response.data.message || 'Invalid OTP. Please try again.'
    } else if (err.response?.status === 429) {
      error.value = 'Too many attempts. Please try again later.'
    } else {
      error.value = 'Verification failed. Please try again.'
    }
    showError(error.value)
    otp.value = ''
  } finally {
    loading.value = false
  }
}

const handleResendOTP = async () => {
  if (!msisdn) {
    error.value = 'Session expired. Please start again.'
    router.push('/')
    return
  }

  error.value = ''
  loading.value = true

  try {
    await api.post('/auth/send-otp', { msisdn: msisdn })
    
    timeRemaining.value = 300
    resendDisabled.value = true
    resendCountdown.value = 60
    
    resendInterval = setInterval(() => {
      resendCountdown.value--
      if (resendCountdown.value <= 0) {
        clearInterval(resendInterval)
        resendDisabled.value = false
      }
    }, 1000)
    
    otp.value = ''
    showSuccess('New OTP sent successfully!')
  } catch (err) {
    if (err.response?.status === 429) {
      error.value = 'Too many requests. Please try again in 15 minutes.'
    } else {
      error.value = 'Failed to resend OTP. Please try again.'
    }
    showError(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!msisdn) {
    router.push('/')
    return
  }
  startCountdown()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (resendInterval) clearInterval(resendInterval)
})
</script>