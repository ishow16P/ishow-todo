<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 p-5 sm:p-6 w-full max-w-sm">
      <h2 class="text-lg font-bold text-neutral-800 dark:text-white mb-4">{{ t.addNewStatus }}</h2>

      <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg p-3 mb-4">{{ error }}</div>

      <form @submit.prevent="handleAdd" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.statusName }}</label>
          <input
            v-model="name"
            type="text"
            required
            class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
            :placeholder="t.statusNamePlaceholder"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.color }}</label>
          <input v-model="color" type="color" class="h-10 w-16 rounded border border-neutral-200/70 dark:border-neutral-700/50 cursor-pointer" />
        </div>
        <div class="flex justify-end gap-3">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
            {{ t.cancel }}
          </button>
          <button
            type="submit"
            :disabled="adding"
            class="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition disabled:opacity-50 cursor-pointer"
          >
            {{ t.add }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProjectStore } from '../stores/projects'
import { useLocaleStore } from '../stores/locale'

const locale = useLocaleStore()
const t = computed(() => locale.t)
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
    error.value = err.response?.data?.message || t.value.addStatusFailed
  } finally {
    adding.value = false
  }
}
</script>
