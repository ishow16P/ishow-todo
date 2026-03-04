<template>
  <div class="min-h-screen bg-stone-50 dark:bg-neutral-900 antialiased transition-colors">
    <Navbar v-if="auth.isAuthenticated" />
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import { useThemeStore } from './stores/theme'
import Navbar from './components/Navbar.vue'

const auth = useAuthStore()
useThemeStore()
</script>
