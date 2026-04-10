<script setup lang="ts">
import { computed } from 'vue'

interface Member {
  id: string
  name: string
  avatar: string
  color: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
  customStatus?: string
  lastSeen?: string
  role?: string
}

const members: Member[] = [
  { id: '1', name: 'Алексей Иванов', avatar: 'А', color: 'primary', status: 'online', role: 'Владелец', customStatus: 'Reviewing PRs' },
  { id: '2', name: 'Мария Петрова', avatar: 'М', color: 'tertiary', status: 'online', role: 'Дизайнер', customStatus: 'В Figma' },
  { id: '3', name: 'Елена Смирнова', avatar: 'Е', color: 'error', status: 'idle', lastSeen: '15 мин назад' },
  { id: '4', name: 'Игорь Волков', avatar: 'И', color: 'secondary', status: 'dnd', customStatus: 'Не беспокоить до 18:00' },
  { id: '5', name: 'Дмитрий Козлов', avatar: 'Д', color: 'secondary', status: 'offline', lastSeen: '2 часа назад' },
  { id: '6', name: 'Анна Новикова', avatar: 'Н', color: 'primary', status: 'offline', lastSeen: '5 часов назад' },
  { id: '7', name: 'Сергей Морозов', avatar: 'С', color: 'tertiary', status: 'offline', lastSeen: 'Вчера' },
  { id: '8', name: 'Ольга Лебедева', avatar: 'О', color: 'secondary', status: 'offline', lastSeen: '3 дня назад' },
]

const statusOrder: Record<string, number> = {
  online: 0,
  idle: 1,
  dnd: 2,
  offline: 3,
}

const statusColor: Record<string, string> = {
  online: '#43a047',
  idle: '#fb8c00',
  dnd: '#e53935',
  offline: '#757575',
}

const onlineMembers = computed(() =>
  members
    .filter(m => m.status !== 'offline')
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status])
)

const offlineMembers = computed(() =>
  members.filter(m => m.status === 'offline')
)
</script>

<template>
  <div class="member-list py-3">
    <!-- Online / Active -->
    <div class="px-4 mb-1">
      <span class="text-label-small font-weight-bold text-on-surface-variant text-uppercase">
        В сети — {{ onlineMembers.length }}
      </span>
    </div>

    <v-list density="compact" class="pa-0 px-2" bg-color="transparent">
      <v-list-item
        v-for="member in onlineMembers"
        :key="member.id"
        rounded="lg"
        class="member-item"
      >
        <template #prepend>
          <v-badge
            :color="statusColor[member.status]"
            dot
            location="bottom end"
            bordered
            offset-x="2"
            offset-y="2"
          >
            <v-avatar size="32" :color="member.color">
              <span class="text-caption font-weight-medium">{{ member.avatar }}</span>
            </v-avatar>
          </v-badge>
        </template>

        <v-list-item-title class="text-body-2">
          {{ member.name }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="member.customStatus" class="text-caption">
          {{ member.customStatus }}
        </v-list-item-subtitle>

        <template v-if="member.role" #append>
          <v-chip size="x-small" variant="tonal" color="primary" class="ml-2">
            {{ member.role }}
          </v-chip>
        </template>
      </v-list-item>
    </v-list>

    <!-- Offline -->
    <div class="px-4 mt-4 mb-1">
      <span class="text-label-small font-weight-bold text-on-surface-variant text-uppercase">
        Не в сети — {{ offlineMembers.length }}
      </span>
    </div>

    <v-list density="compact" class="pa-0 px-2" bg-color="transparent">
      <v-list-item
        v-for="member in offlineMembers"
        :key="member.id"
        rounded="lg"
        class="member-item offline"
      >
        <template #prepend>
          <v-badge
            :color="statusColor[member.status]"
            dot
            location="bottom end"
            bordered
            offset-x="2"
            offset-y="2"
          >
            <v-avatar size="32" :color="member.color" class="offline-avatar">
              <span class="text-caption font-weight-medium">{{ member.avatar }}</span>
            </v-avatar>
          </v-badge>
        </template>

        <v-list-item-title class="text-body-2 text-on-surface-variant">
          {{ member.name }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="member.lastSeen" class="text-caption">
          {{ member.lastSeen }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<style scoped>
.member-list {
  height: 100%;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, rgb(var(--v-theme-on-surface)) 15%, transparent) transparent;

  .member-item {
    min-height: 42px;
    transition: background-color 0.15s ease;

    &.offline {
      :deep(.v-list-item-title) {
        opacity: 0.6;
      }
    }
  }

  .offline-avatar {
    opacity: 0.5;
    filter: saturate(0.7);
  }
}

@supports not (color: color-mix(in srgb, black 50%, transparent)) {
  .member-list {
    scrollbar-color: rgba(var(--v-theme-on-surface), 0.15) transparent;
  }
}
</style>
