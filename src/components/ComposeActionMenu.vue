<script setup lang="ts">
import NewMessageDialog from '@/components/NewMessageDialog.vue'

const emit = defineEmits<{
  'create-group': []
  'create-voice-chat': []
}>()
</script>

<template>
  <v-menu
    open-on-hover
    :open-delay="60"
    :close-delay="220"
    location="bottom start"
    close-on-content-click
    offset="6"
  >
    <template #activator="{ props: menuActivatorProps }">
      <v-btn
        v-bind="menuActivatorProps"
        icon="mdi-square-edit-outline"
        variant="text"
        size="small"
        color="on-surface-variant"
      />
    </template>

    <v-list
      density="compact"
      class="compose-menu-list py-1"
      rounded="lg"
      elevation="4"
      bg-color="surface-container-high"
    >
      <NewMessageDialog>
        <template #activator="{ props: dialogProps }">
          <v-list-item
            v-bind="dialogProps"
            prepend-icon="mdi-message-plus-outline"
            title="Написать сообщение"
            rounded="lg"
            class="px-2"
          />
        </template>
      </NewMessageDialog>

      <v-list-item
        prepend-icon="mdi-account-group-outline"
        title="Создать группу"
        rounded="lg"
        class="px-2"
        @click="emit('create-group')"
      />

      <v-list-item
        prepend-icon="mdi-microphone-plus"
        title="Создать голосовой чат"
        rounded="lg"
        class="px-2"
        @click="emit('create-voice-chat')"
      />
    </v-list>
  </v-menu>
</template>

<style scoped>
.compose-menu-list {
  width: 288px;
  --v-list-prepend-gap: 16px;
}

.compose-menu-list :deep(.v-list-item-title) {
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  line-height: 1.25;
}
</style>
