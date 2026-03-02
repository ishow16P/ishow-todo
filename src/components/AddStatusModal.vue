<template>
  <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-sm">
      <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">เพิ่มสถานะใหม่</h2>

      <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">{{ error }}</div>

      <form @submit.prevent="handleAdd" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อสถานะ</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            placeholder="เช่น Review, Testing"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">สี</label>
          <input v-model="color" type="color" class="h-10 w-16 rounded border border-gray-300 dark:border-gray-600 cursor-pointer" />
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
            ยกเลิก
          </button>
          <button
            type="submit"
            :disabled="adding"
            class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
          >
            เพิ่ม
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProjectStore } from '../stores/projects'

const props = defineProps({ projectId: { type: String, required: true } })
const emit = defineEmits(['close', 'added'])

const projectStore = useProjectStore()
const name = ref('')
const color = ref('#6B7280')
const error = ref('')
const adding = ref(false)

async function handleAdd() {
  error.value = ''
  adding.value = true
  try {
    await projectStore.addStatus(props.projectId, { name: name.value, color: color.value })
    emit('added')
    emit('close')
  } catch (err) {
    error.value = err.response?.data?.message || 'เพิ่มสถานะไม่สำเร็จ'
  } finally {
    adding.value = false
  }
}
</script>
