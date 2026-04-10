<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'

const props = defineProps<{
  channelName: string
}>()

const emit = defineEmits<{
  send: [text: string]
}>()

const showEmojiPicker = ref(false)

const popularEmojis = [
  '😀', '😂', '😍', '🥰', '😎', '🤔', '👍', '👎',
  '❤️', '🔥', '🎉', '✅', '👀', '🙏', '💪', '🚀',
  '😅', '😢', '😡', '🤯', '🤝', '💯', '⭐', '🎯',
  '📌', '💡', '⚡', '🐛', '🔧', '📝', '🗑️', '📎',
]

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit.configure({
      heading: false,
      codeBlock: false,
      horizontalRule: false,
      blockquote: false,
    }),
    Placeholder.configure({
      placeholder: `Написать в #${props.channelName}...`,
    }),
    Underline,
  ],
  editorProps: {
    handleKeyDown(_view, event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSend()
        return true
      }
      return false
    },
    attributes: {
      class: 'editor-content',
    },
  },
})

watch(() => props.channelName, (name) => {
  editor.value?.extensionManager.extensions
    .find(ext => ext.name === 'placeholder')
    ?.options && editor.value?.setOptions({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
        blockquote: false,
      }),
      Placeholder.configure({
        placeholder: `Написать в #${name}...`,
      }),
      Underline,
    ],
  })
})

function handleSend() {
  if (!editor.value) return
  const text = editor.value.getText().trim()
  if (!text) return
  emit('send', editor.value.getHTML())
  editor.value.commands.clearContent()
}

function insertEmoji(emoji: string) {
  editor.value?.commands.insertContent(emoji)
  showEmojiPicker.value = false
  editor.value?.commands.focus()
}

function toggleFormat(format: 'bold' | 'italic' | 'underline' | 'strike' | 'code') {
  if (!editor.value) return
  const chain = editor.value.chain().focus()
  switch (format) {
    case 'bold': chain.toggleBold().run(); break
    case 'italic': chain.toggleItalic().run(); break
    case 'underline': chain.toggleUnderline().run(); break
    case 'strike': chain.toggleStrike().run(); break
    case 'code': chain.toggleCode().run(); break
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="editor-wrapper px-4 pb-4">
    <v-card
      variant="outlined"
      rounded="xl"
      class="editor-card"
      color="outline-variant"
    >
      <!-- Formatting Toolbar -->
      <div class="d-flex align-center px-2 pt-2 toolbar-row">
        <v-btn-group variant="text" density="compact" divided>
          <v-btn
            size="x-small"
            icon="mdi-format-bold"
            :color="editor?.isActive('bold') ? 'primary' : 'on-surface-variant'"
            @click="toggleFormat('bold')"
          />
          <v-btn
            size="x-small"
            icon="mdi-format-italic"
            :color="editor?.isActive('italic') ? 'primary' : 'on-surface-variant'"
            @click="toggleFormat('italic')"
          />
          <v-btn
            size="x-small"
            icon="mdi-format-underline"
            :color="editor?.isActive('underline') ? 'primary' : 'on-surface-variant'"
            @click="toggleFormat('underline')"
          />
          <v-btn
            size="x-small"
            icon="mdi-format-strikethrough-variant"
            :color="editor?.isActive('strike') ? 'primary' : 'on-surface-variant'"
            @click="toggleFormat('strike')"
          />
          <v-btn
            size="x-small"
            icon="mdi-code-tags"
            :color="editor?.isActive('code') ? 'primary' : 'on-surface-variant'"
            @click="toggleFormat('code')"
          />
        </v-btn-group>

        <v-divider vertical class="mx-1 my-1" />

        <v-btn
          size="x-small"
          icon="mdi-format-list-bulleted"
          variant="text"
          color="on-surface-variant"
          @click="editor?.chain().focus().toggleBulletList().run()"
        />
        <v-btn
          size="x-small"
          icon="mdi-format-list-numbered"
          variant="text"
          color="on-surface-variant"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        />
      </div>

      <!-- Editor Area -->
      <div class="px-3 py-1">
        <EditorContent :editor="editor" />
      </div>

      <!-- Bottom Actions -->
      <div class="d-flex align-center justify-space-between px-2 pb-2">
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-plus"
            variant="text"
            size="small"
            color="on-surface-variant"
          />
          <v-menu
            v-model="showEmojiPicker"
            :close-on-content-click="false"
            location="top start"
            offset="8"
          >
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                icon="mdi-emoticon-happy-outline"
                variant="text"
                size="small"
                color="on-surface-variant"
              />
            </template>
            <v-card rounded="xl" width="340" class="emoji-picker">
              <v-card-text class="pa-3">
                <div class="text-caption text-on-surface-variant mb-2">Популярные</div>
                <div class="emoji-grid">
                  <v-btn
                    v-for="emoji in popularEmojis"
                    :key="emoji"
                    variant="text"
                    size="small"
                    class="emoji-btn"
                    @click="insertEmoji(emoji)"
                  >
                    {{ emoji }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
          <v-btn
            icon="mdi-at"
            variant="text"
            size="small"
            color="on-surface-variant"
          />
        </div>

        <v-btn
          icon="mdi-send"
          variant="tonal"
          size="small"
          color="primary"
          :disabled="!editor?.getText().trim()"
          @click="handleSend"
        />
      </div>
    </v-card>
  </div>
</template>

<style scoped>
.editor-wrapper {
  flex-shrink: 0;
}

.toolbar-row {
  gap: 2px;
}

.editor-card :deep(.editor-content) {
  font-size: 0.875rem;
  line-height: 1.5;
  min-height: 36px;
  max-height: 160px;
  overflow-y: auto;
  outline: none;
  padding: 4px 0;
}

.editor-card :deep(.editor-content p) {
  margin: 0;
}

.editor-card :deep(.tiptap p.is-editor-empty:first-child::before) {
  color: rgba(var(--v-theme-on-surface), 0.4);
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.editor-card :deep(.editor-content code) {
  background-color: rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 4px;
  padding: 2px 4px;
  font-size: 0.8125rem;
}

.editor-card :deep(.editor-content ul),
.editor-card :deep(.editor-content ol) {
  padding-left: 1.25rem;
  margin: 4px 0;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 2px;
}

.emoji-btn {
  min-width: 36px !important;
  width: 36px;
  height: 36px;
  font-size: 1.25rem;
  padding: 0 !important;
}
</style>
