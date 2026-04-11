<script setup lang="ts">
import { useLink } from '@kitbag/router'

const props = defineProps<{
  workspaceId: string
  name: string
  icon: string
}>()

const { href, isMatch, push } = useLink('workspace', { workspaceId: props.workspaceId })

</script>

<template>
  <v-tooltip :text="name" location="end">
    <template #activator="{ props: tooltipProps }">
      <v-btn
        v-bind="tooltipProps"
        :icon="icon"
        class="rail-btn"
        :color="isMatch ? 'primary' : 'on-surface-variant'"
        :variant="isMatch ? 'tonal' : 'text'"
        rounded="lg"
        :to="href"
        @click.stop="push()"
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
