<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <img
          src="https://media.licdn.com/dms/image/v2/C4D0BAQFOEhKMYfI2mw/company-logo_200_200/company-logo_200_200/0/1662447492960?e=2147483647&v=beta&t=H5yRcTh09LcEj_Mv7WtoRMFyzy2RmI4t1h4vTxXeUAs"
          alt="AkhilDevs Logo"
          class="h-8 w-8 rounded"
        />
        <DarkModeToggle />
      </div>
    </div>
  </header>
</template>

<script setup>
import DarkModeToggle from './DarkModeToggle.vue'
</script>