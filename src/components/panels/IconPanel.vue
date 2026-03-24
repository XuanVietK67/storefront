<template>
  <div class="flex flex-col gap-[9px]">
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">Pick an icon</p>
    <EmojiGrid :items="ICONS" @pick="addIcon" />

    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">Icon color</p>
    <ColorStrip v-model="color" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import EmojiGrid  from '@/components/ui/EmojiGrid.vue'
import ColorStrip from '@/components/ui/ColorStrip.vue'
import { ICONS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'

const { addIcon, curColor } = useCanvas()
const color = ref(curColor.value)
watch(color, v => { curColor.value = v })
</script>
