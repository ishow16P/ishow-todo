<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
      <h1 class="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">โปรเจคของฉัน</h1>
      <button
        @click="showCreate = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition cursor-pointer self-start sm:self-auto"
      >
        + สร้างโปรเจค
      </button>
    </div>

    <div v-if="projectStore.loading" class="text-center text-gray-400 dark:text-gray-500 py-12">กำลังโหลด...</div>

    <div v-else-if="projectStore.projects.length === 0" class="text-center py-16 sm:py-20">
      <p class="text-gray-400 dark:text-gray-500 text-lg mb-4">ยังไม่มีโปรเจค</p>
      <button
        @click="showCreate = true"
        class="text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
      >
        สร้างโปรเจคแรกของคุณ
      </button>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="project in projectStore.projects"
        :key="project._id"
        :to="`/projects/${project._id}`"
        class="block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition group"
      >
        <h2 class="text-base sm:text-lg font-semibold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {{ project.name }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{{ project.description || 'ไม่มีคำอธิบาย' }}</p>
        <div class="flex items-center gap-3 mt-3 sm:mt-4 text-xs text-gray-400 dark:text-gray-500">
          <span>{{ project.members?.length || 0 }} สมาชิก</span>
          <span>{{ project.statuses?.length || 0 }} สถานะ</span>
        </div>
      </router-link>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreate" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" @click.self="showCreate = false">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 sm:p-6 w-full max-w-md">
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4">สร้างโปรเจคใหม่</h2>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ชื่อโปรเจค</label>
            <input
              v-model="newProject.name"
              type="text"
              required
              class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="เช่น Sprint 1"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">คำอธิบาย (ไม่บังคับ)</label>
            <textarea
              v-model="newProject.description"
              rows="3"
              class="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              placeholder="รายละเอียดโปรเจค..."
            />
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showCreate = false" class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer">
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {{ creating ? 'กำลังสร้าง...' : 'สร้าง' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProjectStore } from '../stores/projects'

const projectStore = useProjectStore()

const showCreate = ref(false)
const creating = ref(false)
const newProject = ref({ name: '', description: '' })

onMounted(() => {
  projectStore.fetchProjects()
})

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
