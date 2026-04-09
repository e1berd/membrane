<script setup lang="ts">
import { useRouter } from '@kitbag/router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h5 mb-4">
          <v-btn icon="mdi-arrow-left" @click="goBack()"/>
          Настройки
      </v-card-title>
      <v-card-text>
        <p>Страница настроек приложения</p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
