<template>
  <div class="min-h-screen animated-gradient">
    <Header />
    <main class="pt-4 pb-4 min-h-screen items-center justify-center">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>
