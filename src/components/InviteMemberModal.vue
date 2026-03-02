<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-md">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">จัดการสมาชิก</h2>

      <!-- Invite form -->
      <form @submit.prevent="handleInvite" class="flex gap-2 mb-6">
        <input
          v-model="email"
          type="email"
          required
          placeholder="อีเมลที่ต้องการเชิญ"
          class="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
        <button
          type="submit"
          :disabled="inviting"
          class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 shrink-0 cursor-pointer"
        >
          เชิญ
        </button>
      </form>

      <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">{{ error }}</div>
      <div v-if="success" class="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-lg p-3 mb-4">{{ success }}</div>

      <!-- Members list -->
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="member in project.members"
          :key="member._id"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2"
        >
          <div>
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100">{{ member.name }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ member.email }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="member._id === project.owner._id" class="text-xs text-indigo-600 dark:text-indigo-400 font-medium">เจ้าของ</span>
            <button
              v-else-if="isOwner"
              @click="handleRemove(member._id)"
              class="text-xs text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 cursor-pointer"
            >
              ลบ
            </button>
          </div>
        </div>
      </div>

      <div class="flex justify-end mt-4">
        <button @click="$emit('close')" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'

const props = defineProps({ project: { type: Object, required: true } })
defineEmits(['close'])

const projectStore = useProjectStore()
const auth = useAuthStore()

const email = ref('')
const error = ref('')
const success = ref('')
const inviting = ref(false)

const isOwner = computed(() => props.project.owner._id === auth.user?._id)

async function handleInvite() {
  error.value = ''
  success.value = ''
  inviting.value = true
  try {
    await projectStore.inviteMember(props.project._id, email.value)
    success.value = `เชิญ ${email.value} สำเร็จ`
    email.value = ''
  } catch (err) {
    error.value = err.response?.data?.message || 'เชิญสมาชิกไม่สำเร็จ'
  } finally {
    inviting.value = false
  }
}

async function handleRemove(userId) {
  try {
    await projectStore.removeMember(props.project._id, userId)
  } catch (err) {
    error.value = err.response?.data?.message || 'ลบสมาชิกไม่สำเร็จ'
  }
}
</script>
