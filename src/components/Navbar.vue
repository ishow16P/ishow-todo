<template>
  <nav class="bg-white dark:bg-neutral-800 border-b border-neutral-200/70 dark:border-neutral-700/50 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-14 items-center">
        <div class="flex items-center gap-5">
          <router-link to="/" class="flex items-center gap-2 text-lg font-semibold text-neutral-800 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 transition">
            <img src="/bapho.png" alt="logo" class="w-7 h-7 rounded-full object-cover" />
            <span class="hidden sm:inline">ishow-todos</span>
          </router-link>

          <!-- Navigation tabs -->
          <div class="flex items-center gap-0.5 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg p-0.5">
            <router-link
              to="/"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition"
              :class="isProjectsActive
                ? 'bg-white dark:bg-neutral-600 text-neutral-800 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              <span class="hidden sm:inline">{{ t.projects }}</span>
            </router-link>
            <router-link
              to="/calendar"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition"
              :class="route.path === '/calendar'
                ? 'bg-white dark:bg-neutral-600 text-neutral-800 dark:text-white shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span class="hidden sm:inline">{{ t.calendar }}</span>
            </router-link>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Language toggle -->
          <button
            @click="locale.toggle()"
            class="px-2 py-1 rounded-lg text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer border border-neutral-200/70 dark:border-neutral-700/50"
            :title="locale.lang === 'th' ? 'Switch to English' : 'เปลี่ยนเป็นภาษาไทย'"
          >
            {{ locale.lang === 'th' ? 'EN' : 'TH' }}
          </button>

          <!-- Theme toggle -->
          <button
            @click="theme.toggle()"
            class="p-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition cursor-pointer"
            :title="theme.dark ? t.switchToLight : t.switchToDark"
          >
            <svg v-if="theme.dark" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>

          <span class="text-sm text-neutral-600 dark:text-neutral-300 hidden sm:inline">{{ auth.user?.name }}</span>
          <button
            @click="handleLogout"
            class="text-sm text-neutral-500 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer"
          >
            {{ t.logout }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useLocaleStore } from '../stores/locale'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const theme = useThemeStore()
const locale = useLocaleStore()
const t = computed(() => locale.t)
const router = useRouter()
const route = useRoute()

const isProjectsActive = computed(() => {
  return route.path === '/' || route.path.startsWith('/projects')
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
