<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-white">{{ t.myProjects }}</h1>
      <button
        @click="showCreate = true"
        class="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition cursor-pointer self-start sm:self-auto"
      >
        {{ t.createProject }}
      </button>
    </div>

    <div v-if="projectStore.loading" class="text-center text-neutral-400 dark:text-neutral-500 py-12">{{ t.loading }}</div>

    <div v-else-if="projectStore.projects.length === 0" class="text-center py-16 sm:py-20">
      <p class="text-neutral-400 dark:text-neutral-500 text-lg mb-4">{{ t.noProjects }}</p>
      <button
        @click="showCreate = true"
        class="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
      >
        {{ t.createFirstProject }}
      </button>
    </div>

    <template v-else>
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <div class="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t.searchProjects"
            class="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none placeholder-neutral-400 dark:placeholder-neutral-500"
          />
        </div>
        <select
          v-model="sortBy"
          class="px-3 py-2 text-sm border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-md focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none cursor-pointer"
        >
          <option value="newest">{{ t.sortNewest }}</option>
          <option value="name">{{ t.sortName }}</option>
          <option value="members">{{ t.sortMembers }}</option>
        </select>
      </div>

      <div v-if="filteredProjects.length === 0" class="text-center py-12">
        <p class="text-neutral-400 dark:text-neutral-500">{{ t.noSearchResults }}</p>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="project in filteredProjects"
          :key="project._id"
        class="relative bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200/70 dark:border-neutral-700/50 p-4 sm:p-5 hover:bg-neutral-50 dark:hover:bg-neutral-750 transition group"
      >
        <button
          v-if="project.owner?._id === auth.user?._id"
          @click="handleDelete(project)"
          class="absolute top-3 right-3 text-neutral-300 dark:text-neutral-600 hover:text-red-500 dark:hover:text-red-400 transition opacity-0 group-hover:opacity-100 cursor-pointer"
          :title="t.deleteProject"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
        <router-link :to="`/projects/${project._id}`" class="block">
          <h2 class="text-base sm:text-lg font-semibold text-neutral-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
            {{ project.name }}
          </h2>
          <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">{{ project.description || t.noDescription }}</p>
          <div class="flex items-center gap-3 mt-3 sm:mt-4 text-xs text-neutral-400 dark:text-neutral-500">
            <span>{{ project.members?.length || 0 }} {{ t.members }}</span>
            <span>{{ project.statuses?.length || 0 }} {{ t.statuses }}</span>
          </div>
        </router-link>
      </div>
      </div>
    </template>

    <!-- Create Project Modal -->
    <div v-if="showCreate" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" @click.self="showCreate = false">
      <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200/70 dark:border-neutral-700/50 p-5 sm:p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-neutral-800 dark:text-white mb-4">{{ t.newProject }}</h2>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.projectName }}</label>
            <input
              v-model="newProject.name"
              type="text"
              required
              class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none"
              :placeholder="t.projectNamePlaceholder"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">{{ t.descriptionOptional }}</label>
            <textarea
              v-model="newProject.description"
              rows="3"
              class="w-full border border-neutral-200/70 dark:border-neutral-700/50 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400/40 focus:border-blue-400 outline-none resize-none"
              :placeholder="t.projectDescPlaceholder"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showCreate = false" class="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
              {{ t.cancel }}
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="bg-neutral-800 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-900 dark:hover:bg-neutral-200 transition disabled:opacity-50 cursor-pointer"
            >
              {{ creating ? t.creating : t.create }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useProjectStore } from '../stores/projects'
import { useAuthStore } from '../stores/auth'
import { useLocaleStore } from '../stores/locale'

const projectStore = useProjectStore()
const auth = useAuthStore()
const locale = useLocaleStore()
const t = computed(() => locale.t)

const showCreate = ref(false)
const creating = ref(false)
const newProject = ref({ name: '', description: '' })
const searchQuery = ref('')
const sortBy = ref('newest')

const filteredProjects = computed(() => {
  let results = projectStore.projects

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    results = results.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    )
  }

  return [...results].sort((a, b) => {
    if (sortBy.value === 'name') {
      return (a.name || '').localeCompare(b.name || '', 'th')
    }
    if (sortBy.value === 'members') {
      return (b.members?.length || 0) - (a.members?.length || 0)
    }
    const aKey = a.createdAt || a._id || ''
    const bKey = b.createdAt || b._id || ''
    return bKey > aKey ? 1 : bKey < aKey ? -1 : 0
  })
})

onMounted(() => {
  projectStore.fetchProjects()
})

async function handleDelete(project) {
  const { isConfirmed } = await Swal.fire({
    title: t.value.deleteProjectTitle,
    text: `"${project.name}" ${t.value.deleteProjectText}`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    confirmButtonText: t.value.deleteConfirm,
    cancelButtonText: t.value.cancel,
  })
  if (!isConfirmed) return
  await projectStore.deleteProject(project._id)
}

async function handleCreate() {
  creating.value = true
  try {
    await projectStore.createProject(newProject.value)
    showCreate.value = false
    newProject.value = { name: '', description: '' }
  } finally {
    creating.value = false
  }
}
</script>
