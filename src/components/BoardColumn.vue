<template>
  <div class="flex-shrink-0 w-64 sm:w-72 bg-gray-100 dark:bg-gray-800/60 rounded-xl flex flex-col max-h-[calc(100vh-180px)] border border-transparent dark:border-gray-700/50 transition-colors">
    <!-- Column header -->
    <div class="flex items-center justify-between px-3 py-2.5 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center gap-2 min-w-0">
        <div class="column-drag-handle cursor-grab active:cursor-grabbing text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition shrink-0" title="ลากเพื่อสลับตำแหน่ง">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
            <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
            <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
          </svg>
        </div>
        <div class="w-3 h-3 rounded-full shrink-0" :style="{ backgroundColor: status.color }"></div>
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{{ status.name }}</h3>
        <span class="text-xs text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700 rounded-full px-1.5 py-0.5 shrink-0">{{ tasks.length }}</span>
      </div>
      <button
        v-if="isOwner"
        @click="$emit('deleteStatus', status)"
        class="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-sm cursor-pointer transition shrink-0 ml-1"
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
    <div class="p-2 border-t border-gray-200 dark:border-gray-700">
      <button
        @click="showAdd = true"
        class="w-full text-left text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 py-1 cursor-pointer transition"
      >
        + เพิ่ม task
      </button>
    </div>

    <!-- Add task modal -->
    <div v-if="showAdd" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="showAdd = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">เพิ่ม Task ใน {{ status.name }}</h2>
        <form @submit.prevent="handleAdd" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อ</label>
            <input
              v-model="newTitle"
              type="text"
              ref="addInput"
              required
              placeholder="ชื่อ task..."
              class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">รายละเอียด</label>
            <RichTextEditor v-model="newDescription" placeholder="พิมพ์รายละเอียด..." />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">วันเริ่มต้น</label>
              <input
                v-model="newStartDate"
                type="date"
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">วันสิ้นสุด</label>
              <input
                v-model="newEndDate"
                type="date"
                class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showAdd = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer">
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
