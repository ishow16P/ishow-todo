import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          tiptap: [
            '@tiptap/vue-3',
            '@tiptap/starter-kit',
            '@tiptap/extension-underline',
            '@tiptap/extension-placeholder',
          ],
        },
      },
    },
  },
})
