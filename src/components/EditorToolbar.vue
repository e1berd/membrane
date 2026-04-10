<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor | undefined
}>()

function toggleFormat(format: 'bold' | 'italic' | 'underline' | 'strike' | 'code') {
  if (!props.editor) return
  const chain = props.editor.chain().focus()
  switch (format) {
    case 'bold': chain.toggleBold().run(); break
    case 'italic': chain.toggleItalic().run(); break
    case 'underline': chain.toggleUnderline().run(); break
    case 'strike': chain.toggleStrike().run(); break
    case 'code': chain.toggleCode().run(); break
  }
}
</script>

<template>
  <div class="d-flex align-center px-2 pt-2 toolbar-row">
    <v-btn
      size="x-small"
      icon="mdi-format-bold"
      variant="text"
      :color="editor?.isActive('bold') ? 'primary' : 'on-surface-variant'"
      @click="toggleFormat('bold')"
    />
    <v-btn
      size="x-small"
      icon="mdi-format-italic"
      variant="text"
      :color="editor?.isActive('italic') ? 'primary' : 'on-surface-variant'"
      @click="toggleFormat('italic')"
    />
    <v-btn
      size="x-small"
      icon="mdi-format-underline"
      variant="text"
      :color="editor?.isActive('underline') ? 'primary' : 'on-surface-variant'"
      @click="toggleFormat('underline')"
    />
    <v-btn
      size="x-small"
      icon="mdi-format-strikethrough-variant"
      variant="text"
      :color="editor?.isActive('strike') ? 'primary' : 'on-surface-variant'"
      @click="toggleFormat('strike')"
    />
    <v-btn
      size="x-small"
      icon="mdi-code-tags"
      variant="text"
      :color="editor?.isActive('code') ? 'primary' : 'on-surface-variant'"
      @click="toggleFormat('code')"
    />

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
</template>

<style scoped>
.toolbar-row {
  gap: 2px;
  width: 100%;
  overflow: hidden;

  :where(.v-btn) {
    flex-shrink: 0;
  }
}
</style>
