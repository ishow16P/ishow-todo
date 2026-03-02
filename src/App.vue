<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
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
