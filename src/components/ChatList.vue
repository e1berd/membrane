<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  chats: any[]
  hasNextPage?: boolean
  isFetchingNextPage?: boolean
}>()

const emit = defineEmits<{
  loadMore: []
}>()

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && props.hasNextPage && !props.isFetchingNextPage) {
      emit('loadMore')
    }
  })
  if (sentinel.value) observer.observe(sentinel.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <v-list density="compact" nav class="px-2">
    <div v-if="isFetchingNextPage" class="d-flex justify-center pa-2">
      <v-progress-circular indeterminate size="20" />
    </div>
    <!-- <div ref="sentinel" /> -->
  </v-list>
</template>
