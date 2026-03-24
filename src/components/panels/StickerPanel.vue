<template>
  <div class="flex flex-col gap-[9px]">
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">Pick a sticker</p>
    <EmojiGrid :items="STICKERS" @pick="addSticker" />
  </div>
</template>

<script setup>
import EmojiGrid from '@/components/ui/EmojiGrid.vue'
import { STICKERS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'

const { addSticker } = useCanvas()
</script>
