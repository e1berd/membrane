<script setup lang="ts">
import { ref, onUnmounted, useTemplateRef, watch } from 'vue'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'

const BOTTOM_THRESHOLD = 100

const emit = defineEmits<{
  'load-more': []
}>()

const osRef = useTemplateRef<OverlayScrollbarsComponentRef>('osRef')
const contentRef = useTemplateRef<HTMLElement>('contentRef')
const osReady = ref(false)
const showScrollButton = ref(false)

let isAtBottom = true
let resizeObserver: ResizeObserver | null = null
let scrollViewport: HTMLElement | undefined
let initialScrollDone = false

function getViewport() {
  return osRef.value?.osInstance()?.elements().viewport
}

function doScrollToBottom(vp: HTMLElement, smooth = false) {
  scrollViewport?.removeEventListener('scroll', onScroll)
  vp.scrollTo({ top: vp.scrollHeight, behavior: smooth ? 'smooth' : 'instant' })
  showScrollButton.value = false
  isAtBottom = true
  scrollViewport?.addEventListener('scrollend', () => {
    scrollViewport?.addEventListener('scroll', onScroll, { passive: true })
  }, {
    once: true
  })
}

function onScroll() {
  const vp = getViewport()
  if (!vp) return
  const dist = vp.scrollHeight - vp.scrollTop - vp.clientHeight
  isAtBottom = dist < BOTTOM_THRESHOLD
  showScrollButton.value = !isAtBottom
  if (vp.scrollTop < 100) emit('load-more')
}

function onContentResize() {
  const vp = getViewport()
  if (!vp) return
  if (!initialScrollDone) {
    initialScrollDone = true
    doScrollToBottom(vp)
    return
  }
  if (isAtBottom) doScrollToBottom(vp)
}

function scrollToBottom(smooth = false) {
  const vp = getViewport()
  if (vp) doScrollToBottom(vp, smooth)
}

function reset() {
  initialScrollDone = false
  isAtBottom = true
  showScrollButton.value = false
}

watch(osReady, (ready) => {
  if (!ready) return
  const vp = getViewport()
  if (!vp) return
  scrollViewport = vp
  vp.addEventListener('scroll', onScroll, { passive: true })

  if (contentRef.value) {
    resizeObserver = new ResizeObserver(onContentResize)
    resizeObserver.observe(contentRef.value)
  }
})

onUnmounted(() => {
  scrollViewport?.removeEventListener('scroll', onScroll)
  resizeObserver?.disconnect()
})

defineExpose({ scrollToBottom, reset })
</script>

<template>
  <div class="chat-scroll-area">
    <OverlayScrollbarsComponent
      ref="osRef"
      class="chat-scroll-viewport"
      :options="{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-membrane' } }"
      @os-initialized="osReady = true"
    >
      <div ref="contentRef" class="chat-scroll-content">
        <div class="chat-scroll-spacer" />
        <slot />
      </div>
    </OverlayScrollbarsComponent>

    <Transition name="scroll-btn">
      <v-btn
        v-if="showScrollButton"
        icon="mdi-chevron-down"
        class="scroll-to-bottom-btn"
        size="small"
        elevation="3"
        color="surface-container-high"
        @click="scrollToBottom(true)"
      />
    </Transition>
  </div>
</template>

<style scoped>
.chat-scroll-area {
  position: relative;
  overflow: hidden;
}

.chat-scroll-viewport {
  height: 100%;
  overflow: hidden;
  padding-block: 8px;
}

.chat-scroll-content {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.chat-scroll-spacer {
  flex: 1;
}

.scroll-to-bottom-btn {
  position: absolute;
  bottom: 12px;
  right: 16px;
  z-index: 10;
}

.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.85);
}
</style>
