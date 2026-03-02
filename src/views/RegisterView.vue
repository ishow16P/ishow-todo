<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4 transition-colors">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md">
      <h1 class="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">ishow-todos</h1>
      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">สมัครสมาชิก</p>

      <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">
        {{ error }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อ</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="ชื่อของคุณ"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">อีเมล</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รหัสผ่าน</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
        >
          {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        มีบัญชีอยู่แล้ว?
        <router-link to="/login" class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">เข้าสู่ระบบ</router-link>
      </p>

      <div class="flex justify-center mt-4">
        <button @click="theme.toggle()" class="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer">
          {{ theme.dark ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const auth = useAuthStore()
const theme = useThemeStore()
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
    error.value = err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ'
  } finally {
    loading.value = false
  }
}
</script>
