<template>
  <div class="h-[calc(100vh-56px)] flex flex-col">
    <!-- Board header -->
    <div class="bg-white dark:bg-neutral-800 border-b border-neutral-200/70 dark:border-neutral-700/50 px-3 sm:px-6 py-3 transition-colors">
      <div class="flex items-center justify-between max-w-full">
        <div class="flex items-center gap-2 sm:gap-3 min-w-0">
          <router-link to="/" class="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition shrink-0">&larr;</router-link>
          <input
            v-if="editingName"
            ref="nameInputRef"
            v-model="editNameValue"
            @keydown.enter="saveName"
            @keydown.escape="editingName = false"
            @blur="saveName"
            class="text-base sm:text-lg font-bold text-neutral-800 dark:text-white bg-transparent border-b-2 border-blue-400 outline-none min-w-0"
          />
          <h1
            v-else
            class="text-base sm:text-lg font-bold text-neutral-800 dark:text-white truncate"
            :class="{ 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400': isOwner }"
            @click="startEditName"
          >{{ project?.name }}</h1>
        </div>
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            @click="showInvite = true"
            class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-700/50 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer"
          >
            <span class="hidden sm:inline">สมาชิก </span>({{ project?.members?.length || 0 }})
          </button>
          <button
            v-if="isOwner"
            @click="showAddStatus = true"
            class="text-xs sm:text-sm bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 sm:px-3 py-1.5 rounded-lg hover:bg-neutral-900 dark:hover:bg-neutral-200 transition cursor-pointer"
          >
            + <span class="hidden sm:inline">สถานะ</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 flex items-center justify-center text-neutral-400 dark:text-neutral-500">กำลังโหลด...</div>

    <!-- Board columns -->
    <div v-else class="flex-1 overflow-x-auto p-3 sm:p-4">
      <draggable
        v-model="draggableStatuses"
        item-key="_id"
        :group="{ name: 'columns' }"
        ghost-class="opacity-30"
        handle=".column-drag-handle"
        direction="horizontal"
        class="flex gap-3 sm:gap-4 h-full"
        @end="onColumnDragEnd"
      >
        <template #item="{ element: status }">
          <div :data-status="status.name">
            <BoardColumn
              :status="status"
              :tasks="getTasksByStatus(status.name)"
              :is-owner="isOwner"
              @add-task="handleAddTask"
              @move-task="handleMoveTask"
              @view-task="openViewTask"
              @edit-task="openEditTask"
              @delete-task="handleDeleteTask"
              @delete-status="handleDeleteStatus"
            />
          </div>
        </template>
      </draggable>
    </div>

    <!-- Modals -->
    <AddStatusModal
      v-if="showAddStatus"
      :project-id="projectId"
      @close="showAddStatus = false"
      @added="refreshBoard"
    />

    <InviteMemberModal
      v-if="showInvite && project"
      :project="project"
      @close="showInvite = false"
    />

    <!-- View Task Detail Modal -->
    <div v-if="viewingTask" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="viewingTask = null">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 p-5 sm:p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div class="flex items-start justify-between gap-3 mb-4">
          <h2 class="text-lg font-bold text-neutral-800 dark:text-white">{{ viewingTask.title }}</h2>
          <button @click="viewingTask = null" class="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 text-xl leading-none cursor-pointer shrink-0">&times;</button>
        </div>

        <div class="flex flex-wrap items-center gap-2 mb-4">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" :style="{ backgroundColor: getStatusColor(viewingTask.status) + '20', color: getStatusColor(viewingTask.status) }">
            <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: getStatusColor(viewingTask.status) }"></span>
            {{ viewingTask.status }}
          </span>
          <span v-if="viewingTask.assignee" class="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 px-2.5 py-1 rounded-full">
            <span class="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-[9px] font-bold">{{ viewingTask.assignee.name?.charAt(0).toUpperCase() }}</span>
            {{ viewingTask.assignee.name }}
          </span>
        </div>

        <!-- Dates -->
        <div v-if="viewingTask.startDate || viewingTask.endDate" class="flex flex-wrap items-center gap-3 mb-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span v-if="viewingTask.startDate" class="inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            เริ่ม: {{ formatDate(viewingTask.startDate) }}
          </span>
          <span v-if="viewingTask.endDate" class="inline-flex items-center gap-1" :class="isOverdue(viewingTask) ? 'text-red-500 dark:text-red-400 font-medium' : ''">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            สิ้นสุด: {{ formatDate(viewingTask.endDate) }}
          </span>
        </div>

        <div v-if="viewingTask.description && viewingTask.description !== '<p></p>'" class="task-detail-desc text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed" v-html="viewingTask.description"></div>
        <p v-else class="text-sm text-neutral-400 dark:text-neutral-500 italic">ไม่มีรายละเอียด</p>

        <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-neutral-200/70 dark:border-neutral-700/50">
          <button
            @click="switchToEdit"
            class="text-sm text-neutral-600 dark:text-neutral-300 border border-neutral-200/70 dark:border-neutral-700/50 px-3 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer"
          >
            แก้ไข
          </button>
          <button @click="viewingTask = null" class="text-sm bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-1.5 rounded-lg hover:bg-neutral-900 dark:hover:bg-neutral-200 transition cursor-pointer">
            ปิด
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Task Modal -->
    <div v-if="editingTask" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="editingTask = null">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 p-5 sm:p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-neutral-800 dark:text-white mb-4">แก้ไข Task</h2>
        <form @submit.prevent="handleUpdateTask" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">ชื่อ</label>
            <input
              v-model="editForm.title"
              type="text"
              required
              class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">รายละเอียด</label>
            <RichTextEditor v-model="editForm.description" placeholder="พิมพ์รายละเอียด..." />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">วันเริ่มต้น</label>
              <input
                v-model="editForm.startDate"
                type="date"
                class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">วันสิ้นสุด</label>
              <input
                v-model="editForm.endDate"
                type="date"
                class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">ผู้รับผิดชอบ</label>
            <select
              v-model="editForm.assignee"
              class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
            >
              <option value="">ไม่ระบุ</option>
              <option v-for="m in project?.members" :key="m._id" :value="m._id">{{ m.name }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="editingTask = null" class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
              ยกเลิก
            </button>
            <button type="submit" class="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition cursor-pointer">
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
import draggable from 'vuedraggable'
import { useProjectStore } from '../stores/projects'
import { useTaskStore } from '../stores/tasks'
import { useAuthStore } from '../stores/auth'
import BoardColumn from '../components/BoardColumn.vue'
import AddStatusModal from '../components/AddStatusModal.vue'
import InviteMemberModal from '../components/InviteMemberModal.vue'
import RichTextEditor from '../components/RichTextEditor.vue'

const route = useRoute()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const auth = useAuthStore()

const projectId = route.params.id
const loading = ref(true)
const showAddStatus = ref(false)
const showInvite = ref(false)
const viewingTask = ref(null)
const editingTask = ref(null)
const editForm = ref({ title: '', description: '', assignee: '', startDate: '', endDate: '' })
const editingName = ref(false)
const editNameValue = ref('')
const nameInputRef = ref(null)

const project = computed(() => projectStore.currentProject)
const isOwner = computed(() => project.value?.owner?._id === auth.user?._id)

const draggableStatuses = ref([])

watch(
  () => project.value?.statuses,
  (statuses) => {
    if (!statuses) return
    draggableStatuses.value = [...statuses].sort((a, b) => a.order - b.order)
  },
  { immediate: true }
)

function getTasksByStatus(statusName) {
  return taskStore.getTasksByStatus(statusName)
}

async function startEditName() {
  if (!isOwner.value) return
  editNameValue.value = project.value?.name || ''
  editingName.value = true
  await nextTick()
  nameInputRef.value?.select()
}

async function saveName() {
  if (!editingName.value) return
  editingName.value = false
  const trimmed = editNameValue.value.trim()
  if (!trimmed || trimmed === project.value?.name) return
  await projectStore.updateProject(projectId, { name: trimmed })
}

async function refreshBoard() {
  await Promise.all([
    projectStore.fetchProject(projectId),
    taskStore.fetchTasks(projectId),
  ])
}

onMounted(async () => {
  try {
    await refreshBoard()
  } finally {
    loading.value = false
  }
})

async function onColumnDragEnd() {
  const reordered = draggableStatuses.value.map((s, i) => ({ ...s, order: i }))
  draggableStatuses.value = reordered
  await projectStore.updateStatuses(projectId, reordered)
}

async function handleAddTask({ title, description, startDate, endDate, status }) {
  await taskStore.createTask({ title, description, startDate, endDate, status, project: projectId })
}

async function handleMoveTask({ taskId, status, order }) {
  await taskStore.moveTask(taskId, status, order)
}

function openViewTask(task) {
  viewingTask.value = task
}

function getStatusColor(statusName) {
  const s = project.value?.statuses?.find((st) => st.name === statusName)
  return s?.color || '#6B7280'
}

function switchToEdit() {
  const task = viewingTask.value
  viewingTask.value = null
  openEditTask(task)
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isOverdue(task) {
  if (!task.endDate) return false
  return new Date(task.endDate) < new Date() && task.status !== 'Done'
}

function toDateInput(d) {
  if (!d) return ''
  return new Date(d).toISOString().slice(0, 10)
}

function openEditTask(task) {
  editingTask.value = task
  editForm.value = {
    title: task.title,
    description: task.description || '',
    assignee: task.assignee?._id || '',
    startDate: toDateInput(task.startDate),
    endDate: toDateInput(task.endDate),
  }
}

async function handleUpdateTask() {
  await taskStore.updateTask(editingTask.value._id, editForm.value)
  editingTask.value = null
}

async function handleDeleteTask(taskId) {
  await taskStore.deleteTask(taskId)
}

async function handleDeleteStatus(status) {
  const { isConfirmed } = await Swal.fire({
    title: 'ลบสถานะ?',
    text: `"${status.name}" (ต้องไม่มี task อยู่ในสถานะนี้)`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: 'ลบเลย',
    cancelButtonText: 'ยกเลิก',
  })
  if (!isConfirmed) return
  try {
    await projectStore.deleteStatus(projectId, status._id)
  } catch (err) {
    Swal.fire({
      title: 'เกิดข้อผิดพลาด',
      text: err.response?.data?.message || 'ลบสถานะไม่สำเร็จ',
      icon: 'error',
    })
  }
}
</script>

<style>
.task-detail-desc p { margin: 0.3em 0; }
.task-detail-desc strong { font-weight: 700; }
.task-detail-desc em { font-style: italic; }
.task-detail-desc u { text-decoration: underline; }
.task-detail-desc s { text-decoration: line-through; }
.task-detail-desc ul { list-style-type: disc; padding-left: 1.5em; margin: 0.3em 0; }
.task-detail-desc ol { list-style-type: decimal; padding-left: 1.5em; margin: 0.3em 0; }
.task-detail-desc blockquote { border-left: 3px solid #d6d3d1; padding-left: 0.75em; margin: 0.3em 0; color: #78716c; }
.dark .task-detail-desc blockquote { border-left-color: #57534e; color: #a8a29e; }
.task-detail-desc pre { background: #f5f5f4; border-radius: 0.375rem; padding: 0.5em 0.75em; margin: 0.3em 0; font-family: monospace; font-size: 0.9em; overflow-x: auto; }
.dark .task-detail-desc pre { background: #292524; }
.task-detail-desc code { background: #f5f5f4; border-radius: 0.25rem; padding: 0.1em 0.3em; font-size: 0.9em; }
.dark .task-detail-desc code { background: #292524; }
</style>
