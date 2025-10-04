<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
    <!-- Service Image -->
    <div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700">
      <img
        :src="service.imageUrl"
        :alt="service.name"
        class="w-full h-32 object-cover"
        @error="handleImageError"
      />
    </div>

    <!-- Service Details -->
    <div class="p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{{ service.name }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ service.description }}</p>
      
      <div class="flex items-center justify-between mb-4">
        <span class="text-lg font-bold text-green-600 dark:text-green-400">R{{ service.price }}</span>
        <span class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ service.billingCycle }}</span>
      </div>

      <!-- Subscribe Button -->
      <button
        @click="$emit('subscribe', service._id)"
        :disabled="isSubscribed || loading"
        class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        {{ isSubscribed ? 'Subscribed' : loading ? 'Subscribing...' : 'Subscribe' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  service: {
    type: Object,
    required: true
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits(['subscribe'])

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x200?text=No+Image'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>