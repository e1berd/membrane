<script setup lang="ts">
import { OverlayScrollbarsComponent } from 'overlayscrollbars-vue'
import 'overlayscrollbars/overlayscrollbars.css'
import NewMessageDialog from '@/components/NewMessageDialog.vue'
import SettingsDialog from '@/components/SettingsDialog.vue'
import ChannelList from '@/components/ChannelList.vue'

</script>

<template>
    <ChannelList />
    <div class="home-view">
        <div class="home-content">
        <div class="home-header">
            <v-icon
              icon="mdi-alpha-m-box"
              size="48"
              color="primary"
              class="mb-2"
            />
            <h1 class="text-h4 font-weight-bold">Membrane</h1>
            <p class="text-body-1 text-medium-emphasis mt-1">Ваше пространство для общения</p>
        </div>

        <OverlayScrollbarsComponent
            class="actions-scroll"
            :options="{ scrollbars: { autoHide: 'scroll', theme: 'os-theme-membrane' } }"
            defer
        >
            <div class="actions-grid">
            <NewMessageDialog>
                <template #activator="{ props }">
                <v-card
                    v-bind="props"
                    class="action-card"
                    rounded="xl"
                    variant="tonal"
                    color="primary"
                    ripple
                >
                    <v-card-text class="action-card-content">
                    <v-icon icon="mdi-message-plus-outline" size="32" />
                    <span class="text-body-1 font-weight-medium mt-3">Написать сообщение</span>
                    </v-card-text>
                </v-card>
                </template>
            </NewMessageDialog>

            <v-card
                class="action-card"
                rounded="xl"
                variant="tonal"
                color="secondary"
                ripple
            >
                <v-card-text class="action-card-content">
                <v-icon icon="mdi-layers-plus" size="32" />
                <span class="text-body-1 font-weight-medium mt-3">Создать пространство</span>
                </v-card-text>
            </v-card>

            <SettingsDialog>
                <template #activator="{ props }">
                <v-card
                    v-bind="props"
                    class="action-card"
                    rounded="xl"
                    variant="tonal"
                    color="tertiary"
                    ripple
                >
                    <v-card-text class="action-card-content">
                    <v-icon icon="mdi-cog-outline" size="32" />
                    <span class="text-body-1 font-weight-medium mt-3">Настройки</span>
                    </v-card-text>
                </v-card>
                </template>
            </SettingsDialog>

            <v-card
                class="action-card"
                rounded="xl"
                variant="tonal"
                color="info"
                ripple
            >
                <v-card-text class="action-card-content">
                <v-icon icon="mdi-account-group-outline" size="32" />
                <span class="text-body-1 font-weight-medium mt-3">Создать группу</span>
                </v-card-text>
            </v-card>

            <v-card
                class="action-card"
                rounded="xl"
                variant="tonal"
                color="success"
                ripple
            >
                <v-card-text class="action-card-content">
                <v-icon icon="mdi-microphone-plus" size="32" />
                <span class="text-body-1 font-weight-medium mt-3">Создать голосовой чат</span>
                </v-card-text>
            </v-card>

            <v-card
                class="action-card"
                rounded="xl"
                variant="tonal"
                color="warning"
                ripple
            >
                <v-card-text class="action-card-content">
                <v-icon icon="mdi-link-variant-plus" size="32" />
                <span class="text-body-1 font-weight-medium mt-3">Присоединиться по ссылке</span>
                </v-card-text>
            </v-card>
            </div>
        </OverlayScrollbarsComponent>
        </div>
    </div>
</template>

<style scoped>
.home-view {
  container-type: inline-size;
  flex: 1;
  display: grid;
  place-items: center;
  height: 100%;
  padding: 24px;

  .home-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    max-width: 480px;
    width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .home-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex-shrink: 0;
  }

  .actions-scroll {
    width: 100%;
    overflow: hidden;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    width: 100%;
    padding-bottom: 4px;
  }

  .action-card {
    cursor: pointer;
    transition: transform 0.15s ease;

    &:hover { transform: translateY(-2px); }
  }

  .action-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 28px 16px !important;
    text-align: center;
  }

  @container (max-width: 360px) {
    .actions-grid { grid-template-columns: 1fr; }
  }
}
</style>
