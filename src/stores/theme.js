import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const dark = ref(localStorage.getItem('theme') === 'dark')

  function applyTheme() {
    document.documentElement.classList.toggle('dark', dark.value)
  }

  function toggle() {
    dark.value = !dark.value
  }

  watch(dark, (val) => {
    localStorage.setItem('theme', val ? 'dark' : 'light')
    applyTheme()
  })

  applyTheme()

  return { dark, toggle }
})
