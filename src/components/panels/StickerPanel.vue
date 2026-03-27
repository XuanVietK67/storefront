<template>
  <div class="flex flex-col gap-[9px]">
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.pickSticker') }}</p>
    <EmojiGrid :items="STICKERS" @pick="addSticker" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import EmojiGrid from '@/components/ui/EmojiGrid.vue'
import { STICKERS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'

const { t } = useI18n()
const { addSticker } = useCanvas()
</script>
