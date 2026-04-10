<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import type { ReplyInfo } from './MessageItem.vue'
import EditorToolbar from './EditorToolbar.vue'

const props = defineProps<{
  channelName: string
  replyTo?: ReplyInfo | null
}>()

const emit = defineEmits<{
  send: [text: string]
  'cancel-reply': []
}>()

const replyPreviewText = computed(() => {
  if (!props.replyTo) return ''
  const div = document.createElement('div')
  div.innerHTML = props.replyTo.text
  const plain = div.textContent || ''
  return plain.length > 120 ? plain.slice(0, 120) + '…' : plain
})

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
      <v-slide-y-transition>
        <div v-if="replyTo" class="reply-preview d-flex align-center px-3 pt-2 pb-1">
          <div class="reply-preview-bar flex-grow-1 d-flex align-center gap-2 pa-2 rounded-lg">
            <v-icon icon="mdi-reply" size="16" color="primary" class="reply-icon" />
            <div class="flex-grow-1 min-width-0">
              <div class="text-caption font-weight-bold text-primary">{{ replyTo.sender }}</div>
              <div class="text-caption text-on-surface-variant text-truncate">{{ replyPreviewText }}</div>
            </div>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="x-small"
              color="on-surface-variant"
              @click="emit('cancel-reply')"
            />
          </div>
        </div>
      </v-slide-y-transition>

      <EditorToolbar :editor="editor" />

      <div class="px-3 py-2">
        <EditorContent :editor="editor" />
      </div>

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

.editor-card :deep(.editor-content) {
  font-size: 1rem;
  line-height: 1.5;
  min-height: 36px;
  max-height: 160px;
  overflow-y: auto;
  outline: none;
  padding: 4px 0;
  color: rgb(var(--v-theme-on-surface));
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

.reply-preview-bar {
  background-color: rgba(var(--v-theme-primary), 0.08);
  border-left: 2px solid rgb(var(--v-theme-primary));
}

.reply-icon {
  transform: scaleX(-1);
}

.min-width-0 {
  min-width: 0;
}
</style>
