<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-neutral-900 px-4 transition-colors">
    <div class="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200/70 dark:border-neutral-700/50 p-6 sm:p-8 w-full max-w-sm">
      <h1 class="text-xl sm:text-2xl font-bold text-center text-neutral-800 dark:text-white mb-2">ishow-todos</h1>
      <p class="text-center text-sm text-neutral-500 dark:text-neutral-400 mb-6">{{ t.register }}</p>

      <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.name }}</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition"
            :placeholder="t.yourName"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.email }}</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.password }}</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none transition"
            :placeholder="t.minChars"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 py-2.5 rounded-md font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition disabled:opacity-50 cursor-pointer"
        >
          {{ loading ? t.registering : t.register }}
        </button>
      </form>

      <p class="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
        {{ t.hasAccount }}
        <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">{{ t.login }}</router-link>
      </p>

      <div class="flex justify-center gap-3 mt-4">
        <button @click="locale.toggle()" class="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition cursor-pointer">
          {{ locale.lang === 'th' ? 'English' : 'ภาษาไทย' }}
        </button>
        <span class="text-neutral-300 dark:text-neutral-600">|</span>
        <button @click="theme.toggle()" class="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition cursor-pointer">
          {{ theme.dark ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useLocaleStore } from '../stores/locale'

const auth = useAuthStore()
const theme = useThemeStore()
const locale = useLocaleStore()
const t = computed(() => locale.t)
const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register(name.value, email.value, password.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || t.value.registerFailed
  } finally {
    loading.value = false
  }
}
</script>
