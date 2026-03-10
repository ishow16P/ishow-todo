<template>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <button
          @click="goToday"
          class="px-3 py-1.5 text-sm font-medium border border-neutral-200/70 dark:border-neutral-700/50 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer"
        >
          {{ t.today }}
        </button>
        <div class="flex items-center gap-1">
          <button
            @click="prevMonth"
            class="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            @click="nextMonth"
            class="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        <h1 class="text-lg sm:text-xl font-bold text-neutral-800 dark:text-white">
          {{ monthYearLabel }}
        </h1>
      </div>

      <!-- Project filter -->
      <div class="flex items-center gap-2">
        <select
          v-model="selectedProject"
          class="px-3 py-1.5 text-sm border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none cursor-pointer"
        >
          <option value="">{{ t.allProjects }}</option>
          <option v-for="p in projects" :key="p._id" :value="p._id">{{ p.name }}</option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="taskStore.loading && calendarTasks.length === 0" class="text-center text-neutral-400 dark:text-neutral-500 py-20">
      {{ t.loading }}
    </div>

    <!-- Calendar Grid -->
    <div v-else class="border border-neutral-200/70 dark:border-neutral-700/50 rounded-xl overflow-hidden bg-white dark:bg-neutral-800">
      <!-- Day headers -->
      <div class="grid grid-cols-7 border-b border-neutral-200/70 dark:border-neutral-700/50">
        <div
          v-for="day in dayLabels"
          :key="day"
          class="py-2.5 text-center text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
        >
          {{ day }}
        </div>
      </div>

      <!-- Weeks -->
      <div
        v-for="(week, wi) in weeks"
        :key="wi"
        class="grid grid-cols-7 border-b border-neutral-200/70 dark:border-neutral-700/50 last:border-b-0"
      >
        <div
          v-for="(day, di) in week"
          :key="di"
          class="min-h-[100px] sm:min-h-[120px] border-r border-neutral-200/70 dark:border-neutral-700/50 last:border-r-0 p-1 sm:p-1.5 relative"
          :class="{
            'bg-neutral-50/60 dark:bg-neutral-850': !day.isCurrentMonth,
          }"
        >
          <!-- Date number -->
          <div class="flex items-center justify-center mb-0.5">
            <span
              class="inline-flex items-center justify-center w-7 h-7 text-xs font-medium rounded-full"
              :class="{
                'bg-blue-600 text-white': day.isToday,
                'text-neutral-400 dark:text-neutral-600': !day.isCurrentMonth && !day.isToday,
                'text-neutral-700 dark:text-neutral-300': day.isCurrentMonth && !day.isToday,
              }"
            >
              {{ day.date.getDate() }}
            </span>
          </div>

          <!-- Tasks -->
          <div class="space-y-0.5 overflow-hidden">
            <div
              v-for="task in day.tasks.slice(0, maxVisibleTasks)"
              :key="task._id"
              @click="openTask(task)"
              class="group/task flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] leading-tight truncate cursor-pointer transition"
              :class="getTaskClasses(task)"
              :title="`${task.title} — ${task.project?.name || ''}`"
            >
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :style="{ backgroundColor: getProjectColor(task) }"
              ></span>
              <span class="truncate">{{ task.title }}</span>
            </div>
            <button
              v-if="day.tasks.length > maxVisibleTasks"
              @click="openDayDetail(day)"
              class="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer pl-1"
            >
              +{{ day.tasks.length - maxVisibleTasks }} {{ t.more }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Detail Modal -->
    <div v-if="selectedTask" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="selectedTask = null">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 w-full max-w-md overflow-hidden">
        <div class="px-5 pt-5 pb-4">
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-semibold text-neutral-800 dark:text-white leading-snug">
                {{ selectedTask.title }}
              </h3>
              <div class="flex items-center gap-2 mt-1.5">
                <span
                  class="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium"
                  :style="{
                    backgroundColor: getProjectColor(selectedTask) + '20',
                    color: getProjectColor(selectedTask),
                  }"
                >
                  {{ selectedTask.project?.name }}
                </span>
                <span
                  class="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium"
                  :style="{
                    backgroundColor: getStatusColor(selectedTask) + '20',
                    color: getStatusColor(selectedTask),
                  }"
                >
                  {{ selectedTask.status }}
                </span>
              </div>
            </div>
            <button
              @click="selectedTask = null"
              class="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition cursor-pointer p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Description -->
          <div
            v-if="selectedTask.description && selectedTask.description !== '<p></p>'"
            class="mt-4 text-sm text-neutral-600 dark:text-neutral-400 prose prose-sm dark:prose-invert max-w-none"
            v-html="selectedTask.description"
          />

          <!-- Meta -->
          <div class="mt-4 space-y-2.5">
            <div v-if="selectedTask.startDate || selectedTask.endDate" class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-neutral-400 dark:text-neutral-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span v-if="selectedTask.startDate && selectedTask.endDate">
                {{ formatDate(selectedTask.startDate) }} — {{ formatDate(selectedTask.endDate) }}
              </span>
              <span v-else-if="selectedTask.startDate">{{ t.start }} {{ formatDate(selectedTask.startDate) }}</span>
              <span v-else>{{ t.dueDate }} {{ formatDate(selectedTask.endDate) }}</span>
            </div>
            <div v-if="selectedTask.assignee" class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <div class="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-600 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-[9px] font-bold shrink-0">
                {{ selectedTask.assignee.name?.charAt(0).toUpperCase() }}
              </div>
              <span>{{ selectedTask.assignee.name }}</span>
            </div>
          </div>
        </div>

        <div class="px-5 py-3 bg-neutral-50 dark:bg-neutral-900/40 border-t border-neutral-200/70 dark:border-neutral-700/50 flex justify-end">
          <router-link
            :to="`/projects/${selectedTask.project?._id}`"
            class="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {{ t.goToBoard }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Day Detail Modal -->
    <div v-if="detailDay" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="detailDay = null">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 w-full max-w-sm overflow-hidden">
        <div class="px-5 pt-4 pb-2 border-b border-neutral-200/70 dark:border-neutral-700/50 flex items-center justify-between">
          <h3 class="text-base font-semibold text-neutral-800 dark:text-white">
            {{ formatDate(detailDay.date) }}
          </h3>
          <button @click="detailDay = null" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer p-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="p-3 max-h-80 overflow-y-auto space-y-1.5">
          <div
            v-for="task in detailDay.tasks"
            :key="task._id"
            @click="detailDay = null; openTask(task)"
            class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer transition"
          >
            <span
              class="w-2 h-2 rounded-full shrink-0"
              :style="{ backgroundColor: getProjectColor(task) }"
            ></span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">{{ task.title }}</p>
              <p class="text-[11px] text-neutral-400 dark:text-neutral-500">{{ task.project?.name }}</p>
            </div>
            <span
              class="text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
              :style="{
                backgroundColor: getStatusColor(task) + '20',
                color: getStatusColor(task),
              }"
            >
              {{ task.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTaskStore } from '../stores/tasks'
import { useProjectStore } from '../stores/projects'
import { useLocaleStore } from '../stores/locale'

const taskStore = useTaskStore()
const projectStore = useProjectStore()
const locale = useLocaleStore()
const t = computed(() => locale.t)

const currentDate = ref(new Date())
const selectedProject = ref('')
const selectedTask = ref(null)
const detailDay = ref(null)
const maxVisibleTasks = 3

const dayLabels = computed(() => [
  t.value.dayMon, t.value.dayTue, t.value.dayWed, t.value.dayThu,
  t.value.dayFri, t.value.daySat, t.value.daySun,
])

const PROJECT_COLORS = [
  '#4285F4', '#EA4335', '#FBBC04', '#34A853', '#FF6D01',
  '#46BDC6', '#7B61FF', '#E91E8C', '#00ACC1', '#8D6E63',
]

function getColorForProject(projectId) {
  if (!projectId) return PROJECT_COLORS[0]
  const idx = projects.value.findIndex((p) => p._id === projectId)
  return PROJECT_COLORS[idx >= 0 ? idx % PROJECT_COLORS.length : 0]
}

const projects = computed(() => projectStore.projects)

const calendarTasks = computed(() => {
  let tasks = taskStore.calendarTasks
  if (selectedProject.value) {
    tasks = tasks.filter((t) => (t.project?._id || t.project) === selectedProject.value)
  }
  return tasks
})

const monthYearLabel = computed(() => {
  return currentDate.value.toLocaleDateString(locale.dateLang, { month: 'long', year: 'numeric' })
})

const weeks = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1)
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const startDate = new Date(year, month, 1 - startDow)

  const result = []
  const current = new Date(startDate)

  for (let w = 0; w < 6; w++) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(current)
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)

      const tasks = calendarTasks.value.filter((task) => {
        const tStart = task.startDate ? new Date(task.startDate) : null
        const tEnd = task.endDate ? new Date(task.endDate) : null

        if (tStart && tEnd) {
          return tStart <= dayEnd && tEnd >= dayStart
        }
        if (tStart) {
          const tStartDay = new Date(tStart.getFullYear(), tStart.getMonth(), tStart.getDate())
          return tStartDay.getTime() === dayStart.getTime()
        }
        if (tEnd) {
          const tEndDay = new Date(tEnd.getFullYear(), tEnd.getMonth(), tEnd.getDate())
          return tEndDay.getTime() === dayStart.getTime()
        }
        return false
      })

      week.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday:
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
        tasks,
      })
      current.setDate(current.getDate() + 1)
    }
    if (w === 5 && !week.some((d) => d.isCurrentMonth)) break
    result.push(week)
  }

  return result
})

function prevMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() - 1)
  currentDate.value = d
}

function nextMonth() {
  const d = new Date(currentDate.value)
  d.setMonth(d.getMonth() + 1)
  currentDate.value = d
}

function goToday() {
  currentDate.value = new Date()
}

function openTask(task) {
  selectedTask.value = task
}

function openDayDetail(day) {
  detailDay.value = day
}

function getProjectColor(task) {
  const pid = task.project?._id || task.project
  return getColorForProject(pid)
}

function getStatusColor(task) {
  const statuses = task.project?.statuses
  if (!statuses) return '#6B7280'
  const found = statuses.find((s) => s.name === task.status)
  return found?.color || '#6B7280'
}

function getTaskClasses(task) {
  const isDone = task.status === 'Done'
  if (isDone) {
    return 'bg-neutral-100 dark:bg-neutral-600/40 text-neutral-400 dark:text-neutral-500 line-through'
  }
  return 'bg-neutral-50 dark:bg-neutral-700/60 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600/60'
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString(locale.dateLang, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function loadTasks() {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const start = new Date(year, month - 1, 1).toISOString()
  const end = new Date(year, month + 2, 0).toISOString()
  taskStore.fetchCalendarTasks(start, end)
}

watch(currentDate, loadTasks)

onMounted(() => {
  projectStore.fetchProjects()
  loadTasks()
})
</script>
