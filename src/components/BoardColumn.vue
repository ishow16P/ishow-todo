<template>
  <div class="w-full sm:flex-shrink-0 sm:w-72 bg-stone-100/50 dark:bg-neutral-800/60 rounded-lg flex flex-col sm:max-h-[calc(100vh-180px)] border border-neutral-200/70 dark:border-neutral-700/50 transition-colors">
    <!-- Column header -->
    <div class="flex items-center justify-between px-3 py-2.5 border-b border-neutral-200/70 dark:border-neutral-700/50">
      <div class="flex items-center gap-2 min-w-0">
        <div class="column-drag-handle cursor-grab active:cursor-grabbing text-neutral-300 dark:text-neutral-600 hover:text-neutral-500 dark:hover:text-neutral-400 transition shrink-0" title="ลากเพื่อสลับตำแหน่ง">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
          </svg>
        </div>
        <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: status.color }"></div>
        <h3 class="text-sm font-semibold text-neutral-700 dark:text-neutral-200 truncate">{{ status.name }}</h3>
        <span class="text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-200/70 dark:bg-neutral-700 rounded-full px-1.5 py-0.5 shrink-0">{{ tasks.length }}</span>
      </div>
      <button
        v-if="isOwner"
        @click="$emit('deleteStatus', status)"
        class="text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400 text-sm cursor-pointer transition shrink-0 ml-1"
        title="ลบสถานะ"
      >
        &times;
      </button>
    </div>

    <!-- Draggable tasks -->
    <div class="flex-1 overflow-y-auto p-2 space-y-2">
      <draggable
        :list="tasks"
        :group="{ name: 'tasks' }"
        item-key="_id"
        ghost-class="opacity-30"
        drag-class="rotate-2"
        @change="onChange"
        class="min-h-[40px] space-y-2"
        :data-status="status.name"
      >
        <template #item="{ element }">
          <TaskCard
            :task="element"
            @view="$emit('viewTask', $event)"
            @edit="$emit('editTask', $event)"
            @delete="$emit('deleteTask', $event)"
          />
        </template>
      </draggable>
    </div>

    <!-- Add task button -->
    <div class="p-2 border-t border-neutral-200/70 dark:border-neutral-700/50">
      <button
        @click="showAdd = true"
        class="w-full text-left text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 py-1 cursor-pointer transition"
      >
        + เพิ่ม task
      </button>
    </div>

    <!-- Add task modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="showAdd = false">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 p-5 sm:p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-neutral-800 dark:text-white mb-4">เพิ่ม Task ใน {{ status.name }}</h2>
        <form @submit.prevent="handleAdd" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">ชื่อ</label>
            <input
              v-model="newTitle"
              type="text"
              ref="addInput"
              required
              placeholder="ชื่อ task..."
              class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">รายละเอียด</label>
            <RichTextEditor v-model="newDescription" placeholder="พิมพ์รายละเอียด..." />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">วันเริ่มต้น</label>
              <input
                v-model="newStartDate"
                type="date"
                class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">วันสิ้นสุด</label>
              <input
                v-model="newEndDate"
                type="date"
                class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showAdd = false" class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit" class="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition cursor-pointer">
              เพิ่ม
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'
import RichTextEditor from './RichTextEditor.vue'

const props = defineProps({
  status: { type: Object, required: true },
  tasks: { type: Array, required: true },
  isOwner: { type: Boolean, default: false },
})

const emit = defineEmits(['addTask', 'moveTask', 'viewTask', 'editTask', 'deleteTask', 'deleteStatus'])

const showAdd = ref(false)
const newTitle = ref('')
const newDescription = ref('')
const newStartDate = ref('')
const newEndDate = ref('')
const addInput = ref(null)

function handleAdd() {
  if (!newTitle.value.trim()) return
  const desc = newDescription.value === '<p></p>' ? '' : newDescription.value
  emit('addTask', {
    title: newTitle.value.trim(),
    description: desc,
    startDate: newStartDate.value || null,
    endDate: newEndDate.value || null,
    status: props.status.name,
  })
  newTitle.value = ''
  newDescription.value = ''
  newStartDate.value = ''
  newEndDate.value = ''
  showAdd.value = false
}

function onChange(evt) {
  if (evt.added) {
    const task = evt.added.element
    emit('moveTask', { taskId: task._id, status: props.status.name, order: evt.added.newIndex })
  } else if (evt.moved) {
    const task = evt.moved.element
    emit('moveTask', { taskId: task._id, status: props.status.name, order: evt.moved.newIndex })
  }
}
</script>
