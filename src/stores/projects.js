import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../services/api'

export const useProjectStore = defineStore('projects', () => {
  const projects = ref([])
  const currentProject = ref(null)
  const loading = ref(false)

  async function fetchProjects() {
    loading.value = true
    try {
      const { data } = await api.get('/projects')
      projects.value = data
    } finally {
      loading.value = false
    }
  }

  async function fetchProject(id) {
    loading.value = true
    try {
      const { data } = await api.get(`/projects/${id}`)
      currentProject.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function createProject(payload) {
    const { data } = await api.post('/projects', payload)
    projects.value.unshift(data)
    return data
  }

  async function updateProject(id, payload) {
    const { data } = await api.put(`/projects/${id}`, payload)
    const idx = projects.value.findIndex((p) => p._id === id)
    if (idx !== -1) projects.value[idx] = data
    if (currentProject.value?._id === id) currentProject.value = data
    return data
  }

  async function deleteProject(id) {
    await api.delete(`/projects/${id}`)
    projects.value = projects.value.filter((p) => p._id !== id)
    if (currentProject.value?._id === id) currentProject.value = null
  }

  async function addStatus(id, payload) {
    const { data } = await api.post(`/projects/${id}/statuses`, payload)
    if (currentProject.value?._id === id) currentProject.value = data
    return data
  }

  async function updateStatuses(id, statuses) {
    const { data } = await api.put(`/projects/${id}/statuses`, { statuses })
    if (currentProject.value?._id === id) currentProject.value = data
    return data
  }

  async function deleteStatus(id, statusId) {
    const { data } = await api.delete(`/projects/${id}/statuses/${statusId}`)
    if (currentProject.value?._id === id) currentProject.value = data
    return data
  }

  async function inviteMember(id, email) {
    const { data } = await api.post(`/projects/${id}/invite`, { email })
    if (currentProject.value?._id === id) currentProject.value = data
    return data
  }

  async function removeMember(id, userId) {
    const { data } = await api.delete(`/projects/${id}/members/${userId}`)
    if (currentProject.value?._id === id) currentProject.value = data
    return data
  }

  return {
    projects,
    currentProject,
    loading,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    addStatus,
    updateStatuses,
    deleteStatus,
    inviteMember,
    removeMember,
  }
})
