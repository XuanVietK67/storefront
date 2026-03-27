<template>
  <div class="flex flex-col gap-[9px]">
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.pickIcon') }}</p>
    <EmojiGrid :items="ICONS" @pick="addIcon" />
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.iconColor') }}</p>
    <ColorStrip v-model="color" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import EmojiGrid  from '@/components/ui/EmojiGrid.vue'
import ColorStrip from '@/components/ui/ColorStrip.vue'
import { ICONS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'

const { t } = useI18n()
const { addIcon, curColor } = useCanvas()
const color = ref(curColor.value)
watch(color, v => { curColor.value = v })
</script>
