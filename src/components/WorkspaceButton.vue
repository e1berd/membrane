<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from '@kitbag/router'

const props = defineProps<{
  workspaceId: string
  name: string
  icon: string
}>()

const route = useRoute()
const router = useRouter()

const isActive = computed(() => route.name === 'workspace' && route.params.workspaceId === props.workspaceId)
</script>

<template>
  <v-tooltip :text="name" location="end">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :icon="icon"
        class="rail-btn"
        :color="isActive ? 'primary' : 'on-surface-variant'"
        :variant="isActive ? 'tonal' : 'text'"
        rounded="lg"
        @click="router.push(`/workspace/${workspaceId}`)"
      />
    </template>
  </v-tooltip>
</template>

<style scoped>
.rail-btn {
  inline-size: 44px;
  block-size: 44px;
  min-inline-size: 44px;
}
</style>
