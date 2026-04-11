<template>
  <div class="empty-state">
    <v-icon
      icon="mdi-account-search-outline"
      size="32"
      color="on-surface-variant"
      class="mb-2"
    />
    <span class="text-caption text-on-surface-variant">
      Пользователи не найдены
    </span>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
}
</style>
