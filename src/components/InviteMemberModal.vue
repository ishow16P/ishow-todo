<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 p-5 sm:p-6 w-full max-w-md">
      <h2 class="text-lg font-bold text-neutral-800 dark:text-white mb-4">จัดการสมาชิก</h2>

      <!-- Invite form -->
      <form @submit.prevent="handleInvite" class="flex gap-2 mb-6">
        <input
          v-model="email"
          type="email"
          required
          placeholder="อีเมลที่ต้องการเชิญ"
          class="flex-1 border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
        />
        <button
          type="submit"
          :disabled="inviting"
          class="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition disabled:opacity-50 shrink-0 cursor-pointer"
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
          class="flex items-center justify-between bg-neutral-50 dark:bg-neutral-700/50 rounded-lg px-3 py-2"
        >
          <div>
            <p class="text-sm font-medium text-neutral-800 dark:text-neutral-100">{{ member.name }}</p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ member.email }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="member._id === project.owner._id" class="text-xs text-blue-600 dark:text-blue-400 font-medium">เจ้าของ</span>
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
        <button @click="$emit('close')" class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
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
