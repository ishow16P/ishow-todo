<template>
  <div class="relative bg-white dark:bg-neutral-700 rounded-lg border border-neutral-200/70 dark:border-neutral-600 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-650 transition cursor-grab active:cursor-grabbing group">
    <div class="flex items-start justify-between gap-2">
      <h4
        class="text-sm font-medium text-neutral-800 dark:text-neutral-100 leading-snug cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
        @click.stop="$emit('view', task)"
      >
        {{ task.title }}
      </h4>
      <button
        @click.stop="showMenu = !showMenu"
        class="opacity-0 group-hover:opacity-100 text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 shrink-0 text-lg leading-none cursor-pointer transition"
      >
        &#8942;
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-x-2 gap-y-1 mt-2">
      <div v-if="hasDescription" class="text-neutral-400 dark:text-neutral-500" title="มีรายละเอียด">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
      </div>
      <span
        v-if="task.endDate"
        class="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded"
        :class="overdue ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-neutral-100 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        {{ shortDate(task.endDate) }}
      </span>
      <div v-if="task.assignee" class="flex items-center gap-1">
        <div class="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-[10px] font-bold">
          {{ task.assignee.name?.charAt(0).toUpperCase() }}
        </div>
        <span class="text-xs text-neutral-400 dark:text-neutral-500">{{ task.assignee.name }}</span>
      </div>
    </div>

    <!-- Context menu -->
    <div v-if="showMenu" class="absolute right-2 top-8 bg-white dark:bg-neutral-700 border border-neutral-200/70 dark:border-neutral-600 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
      <button @click="$emit('view', task)" class="w-full text-left px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 cursor-pointer">
        ดูรายละเอียด
      </button>
      <button @click="$emit('edit', task)" class="w-full text-left px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-600 cursor-pointer">
        แก้ไข
      </button>
      <button @click="$emit('delete', task._id)" class="w-full text-left px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 cursor-pointer">
        ลบ
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'delete', 'view'])

const showMenu = ref(false)

const hasDescription = computed(() => {
  const d = props.task.description
  return d && d !== '' && d !== '<p></p>'
})

const overdue = computed(() => {
  if (!props.task.endDate) return false
  return new Date(props.task.endDate) < new Date() && props.task.status !== 'Done'
})

function shortDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}

function closeMenu() {
  showMenu.value = false
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>
