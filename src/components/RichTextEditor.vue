<template>
  <div class="rich-editor border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-700 transition-colors" :class="{ 'ring-2 ring-indigo-500 border-indigo-500': isFocused }">
    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
      <button
        type="button"
        @click="editor?.chain().focus().toggleBold().run()"
        :class="btnClass(editor?.isActive('bold'))"
        title="ตัวหนา"
      >
        <strong>B</strong>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleItalic().run()"
        :class="btnClass(editor?.isActive('italic'))"
        title="ตัวเอียง"
      >
        <em>I</em>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleUnderline().run()"
        :class="btnClass(editor?.isActive('underline'))"
        title="ขีดเส้นใต้"
      >
        <span class="underline">U</span>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleStrike().run()"
        :class="btnClass(editor?.isActive('strike'))"
        title="ขีดทับ"
      >
        <span class="line-through">S</span>
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <button
        type="button"
        @click="editor?.chain().focus().toggleBulletList().run()"
        :class="btnClass(editor?.isActive('bulletList'))"
        title="รายการจุด"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1" fill="currentColor"/><circle cx="5" cy="12" r="1" fill="currentColor"/><circle cx="5" cy="18" r="1" fill="currentColor"/></svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleOrderedList().run()"
        :class="btnClass(editor?.isActive('orderedList'))"
        title="รายการลำดับ"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="20" y2="6"/><line x1="10" y1="12" x2="20" y2="12"/><line x1="10" y1="18" x2="20" y2="18"/><text x="3" y="8" font-size="7" fill="currentColor" stroke="none" font-family="sans-serif">1</text><text x="3" y="14" font-size="7" fill="currentColor" stroke="none" font-family="sans-serif">2</text><text x="3" y="20" font-size="7" fill="currentColor" stroke="none" font-family="sans-serif">3</text></svg>
      </button>

      <div class="w-px h-5 bg-gray-300 dark:bg-gray-600 mx-1"></div>

      <button
        type="button"
        @click="editor?.chain().focus().toggleCodeBlock().run()"
        :class="btnClass(editor?.isActive('codeBlock'))"
        title="โค้ด"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      </button>
      <button
        type="button"
        @click="editor?.chain().focus().toggleBlockquote().run()"
        :class="btnClass(editor?.isActive('blockquote'))"
        title="อ้างอิง"
      >
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
      </button>
    </div>

    <!-- Editor content -->
    <editor-content :editor="editor" class="prose-editor px-3 py-2 min-h-[80px] max-h-[200px] overflow-y-auto text-sm text-gray-900 dark:text-white" />
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'พิมพ์รายละเอียด...' },
})

const emit = defineEmits(['update:modelValue'])
const isFocused = ref(false)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  editorProps: {
    attributes: {
      class: 'outline-none',
    },
  },
  onUpdate({ editor: e }) {
    emit('update:modelValue', e.getHTML())
  },
  onFocus() {
    isFocused.value = true
  },
  onBlur() {
    isFocused.value = false
  },
})

watch(
  () => props.modelValue,
  (val) => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val || '', false)
    }
  }
)

onBeforeUnmount(() => editor.value?.destroy())

function btnClass(active) {
  return [
    'w-7 h-7 flex items-center justify-center rounded text-xs font-medium cursor-pointer transition',
    active
      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
  ]
}
</script>

<style>
.prose-editor .tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #9ca3af;
  pointer-events: none;
  height: 0;
}
.dark .prose-editor .tiptap p.is-editor-empty:first-child::before {
  color: #6b7280;
}
.prose-editor .tiptap {
  outline: none;
}
.prose-editor .tiptap p {
  margin: 0.25em 0;
}
.prose-editor .tiptap ul,
.prose-editor .tiptap ol {
  padding-left: 1.5em;
  margin: 0.25em 0;
}
.prose-editor .tiptap ul {
  list-style-type: disc;
}
.prose-editor .tiptap ol {
  list-style-type: decimal;
}
.prose-editor .tiptap blockquote {
  border-left: 3px solid #d1d5db;
  padding-left: 0.75em;
  margin: 0.25em 0;
  color: #6b7280;
}
.dark .prose-editor .tiptap blockquote {
  border-left-color: #4b5563;
  color: #9ca3af;
}
.prose-editor .tiptap pre {
  background: #f3f4f6;
  border-radius: 0.375rem;
  padding: 0.5em 0.75em;
  margin: 0.25em 0;
  font-family: monospace;
  font-size: 0.85em;
}
.dark .prose-editor .tiptap pre {
  background: #1f2937;
}
.prose-editor .tiptap code {
  background: #f3f4f6;
  border-radius: 0.25rem;
  padding: 0.1em 0.3em;
  font-size: 0.85em;
}
.dark .prose-editor .tiptap code {
  background: #1f2937;
}
</style>
