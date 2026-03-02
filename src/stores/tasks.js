import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])
  const loading = ref(false)

  async function fetchTasks(projectId) {
    loading.value = true
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`)
      tasks.value = data
    } finally {
      loading.value = false
    }
  }

  async function createTask(payload) {
    const { data } = await api.post('/tasks', payload)
    tasks.value.push(data)
    return data
  }

  async function updateTask(id, payload) {
    const { data } = await api.put(`/tasks/${id}`, payload)
    const idx = tasks.value.findIndex((t) => t._id === id)
    if (idx !== -1) tasks.value[idx] = data
    return data
  }

  async function moveTask(id, status, order) {
    const { data } = await api.patch(`/tasks/${id}/move`, { status, order })
    const idx = tasks.value.findIndex((t) => t._id === id)
    if (idx !== -1) tasks.value[idx] = data
    return data
  }

  async function deleteTask(id) {
    await api.delete(`/tasks/${id}`)
    tasks.value = tasks.value.filter((t) => t._id !== id)
  }

  function getTasksByStatus(statusName) {
    return tasks.value
      .filter((t) => t.status === statusName)
      .sort((a, b) => a.order - b.order)
  }

  return { tasks, loading, fetchTasks, createTask, updateTask, moveTask, deleteTask, getTasksByStatus }
})
