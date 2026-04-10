<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{
  selected: string
}>()

const emit = defineEmits<{
  select: [channel: string]
}>()

const search = ref('')
const channelsExpanded = ref(true)
const dmsExpanded = ref(true)

const channels = ref([
  { id: 'general', name: 'general', unread: 3 },
  { id: 'random', name: 'random', unread: 0 },
  { id: 'dev', name: 'разработка', unread: 12 },
  { id: 'design', name: 'дизайн', unread: 0 },
  { id: 'announcements', name: 'объявления', unread: 1 },
])

const directMessages = ref([
  { id: 'dm-1', name: 'Алексей Иванов', avatar: 'А', online: true, unread: 2 },
  { id: 'dm-2', name: 'Мария Петрова', avatar: 'М', online: true, unread: 0 },
  { id: 'dm-3', name: 'Дмитрий Козлов', avatar: 'Д', online: false, unread: 0 },
  { id: 'dm-4', name: 'Елена Смирнова', avatar: 'Е', online: false, unread: 5 },
])

const filteredChannels = computed(() => {
  if (!search.value) return channels.value
  const q = search.value.toLowerCase()
  return channels.value.filter(c => c.name.toLowerCase().includes(q))
})

const filteredDms = computed(() => {
  if (!search.value) return directMessages.value
  const q = search.value.toLowerCase()
  return directMessages.value.filter(d => d.name.toLowerCase().includes(q))
})
</script>

<template>
  <v-navigation-drawer
    permanent
    :width="260"
    color="surface-container"
    class="channel-drawer"
  >
    <div class="pa-3 pb-1">
      <div class="d-flex align-center justify-space-between mb-3">
        <span class="text-title-medium font-weight-bold">Membrane</span>
        <v-btn
          icon="mdi-square-edit-outline"
          variant="text"
          size="small"
          color="on-surface-variant"
        />
      </div>

      <v-text-field
        v-model="search"
        placeholder="Поиск"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        density="compact"
        rounded="lg"
        flat
        hide-details
        single-line
        class="search-field"
        bg-color="surface-container-high"
      />
    </div>

    <v-list density="compact" nav class="px-2">
      <v-list-item
        prepend-icon="mdi-message-text-outline"
        title="Все сообщения"
        rounded="lg"
        class="mb-1"
      />
      <v-list-item
        prepend-icon="mdi-at"
        title="Упоминания"
        rounded="lg"
        class="mb-1"
      >
        <template #append>
          <v-badge color="error" content="3" inline />
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mx-3 my-1" />

    <v-list density="compact" nav class="px-2">
      <v-list-item
        rounded="lg"
        class="section-header"
        @click="channelsExpanded = !channelsExpanded"
      >
        <template #prepend>
          <v-icon :icon="channelsExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="18" />
        </template>
        <v-list-item-title class="text-label-large font-weight-medium">
          Каналы
        </v-list-item-title>
        <template #append>
          <v-btn
            icon="mdi-plus"
            variant="text"
            size="x-small"
            color="on-surface-variant"
            @click.stop
          />
        </template>
      </v-list-item>

      <v-expand-transition>
        <div v-show="channelsExpanded">
          <v-list-item
            v-for="channel in filteredChannels"
            :key="channel.id"
            :active="selected === channel.id"
            rounded="lg"
            @click="emit('select', channel.id)"
          >
            <template #prepend>
              <v-icon icon="mdi-pound" size="18" class="mr-n1" />
            </template>
            <v-list-item-title :class="{ 'font-weight-bold': channel.unread > 0 }">
              {{ channel.name }}
            </v-list-item-title>
            <template v-if="channel.unread > 0" #append>
              <v-badge color="primary" :content="channel.unread" inline />
            </template>
          </v-list-item>
        </div>
      </v-expand-transition>
    </v-list>

    <v-list density="compact" nav class="px-2">
      <v-list-item
        rounded="lg"
        class="section-header"
        @click="dmsExpanded = !dmsExpanded"
      >
        <template #prepend>
          <v-icon :icon="dmsExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="18" />
        </template>
        <v-list-item-title class="text-label-large font-weight-medium">
          Личные сообщения
        </v-list-item-title>
        <template #append>
          <v-btn
            icon="mdi-plus"
            variant="text"
            size="x-small"
            color="on-surface-variant"
            @click.stop
          />
        </template>
      </v-list-item>

      <v-expand-transition>
        <div v-show="dmsExpanded">
          <v-list-item
            v-for="dm in filteredDms"
            :key="dm.id"
            :active="selected === dm.id"
            rounded="lg"
            @click="emit('select', dm.id)"
          >
            <template #prepend>
              <v-badge
                :color="dm.online ? 'success' : 'grey'"
                dot
                location="bottom end"
                bordered
              >
                <v-avatar size="28" color="surface-variant">
                  <span class="text-caption">{{ dm.avatar }}</span>
                </v-avatar>
              </v-badge>
            </template>
            <v-list-item-title :class="{ 'font-weight-bold': dm.unread > 0 }">
              {{ dm.name }}
            </v-list-item-title>
            <template v-if="dm.unread > 0" #append>
              <v-badge color="primary" :content="dm.unread" inline />
            </template>
          </v-list-item>
        </div>
      </v-expand-transition>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.channel-drawer {
  border-right: 1px solid color-mix(in srgb, rgb(var(--v-theme-outline-variant)) 30%, transparent) !important;
  z-index: 1000;
}

.search-field {
  :deep(.v-field) {
    font-size: 0.875rem;
  }

  :deep(.v-field__input) {
    text-wrap: pretty;
  }
}

.section-header {
  min-height: 32px;
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .channel-drawer {
    border-right: 1px solid rgba(var(--v-theme-outline-variant), 0.3) !important;
  }
}
</style>
