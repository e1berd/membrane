<script setup lang="ts">
import { router } from '@/router'

</script>

<template>
  <v-navigation-drawer
    rail
    permanent
  >

z    <v-list density="compact" nav>
    </v-list>

    <template #append>
        <!-- <v-list density="compact" nav>
            <v-tooltip text="Настройки">
                <template #activator="{ props }">
                    <v-list-item
                        prepend-icon="mdi-cog"
                        @click="navigateToSettings"
                        v-bind="props"
                    />
                </template>
            </v-tooltip>
        </v-list> -->
    </template>
  </v-navigation-drawer>
</template>
