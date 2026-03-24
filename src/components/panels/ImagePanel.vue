<template>
  <div class="flex flex-col gap-3">
    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Upload Source</p>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="src in sources"
        :key="src.label"
        class="group flex flex-col items-center gap-[5px] py-3 px-1 rounded-[10px] cursor-pointer text-center transition-all duration-200 active:scale-[.94]"
        style="background: #211f1b; border: 1px dashed #383532;"
        @mouseenter="(e) => cardHover(e, true)"
        @mouseleave="(e) => cardHover(e, false)"
        @click="showToast(src.toast)"
      >
        <span class="text-[22px] transition-transform duration-200 group-hover:scale-110">{{ src.icon }}</span>
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">{{ src.label }}</span>
        <span class="text-[9px] text-faint">{{ src.sub }}</span>
      </button>
    </div>

    <div class="h-px" style="background: linear-gradient(90deg, transparent, #2c2a26, transparent);" />

    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Quick Add</p>
    <EmojiGrid :items="PRESETS" :inline="false" @pick="addSticker" />
  </div>
</template>

<script setup lang="ts">
import EmojiGrid from '@/components/ui/EmojiGrid.vue'
import { PRESETS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'
import { useToast } from '@/composables/useToast'

const { addSticker } = useCanvas()
const { showToast }  = useToast()

const sources = [
  { icon: '📷', label: 'Camera',  sub: 'Take photo', toast: '📷 Camera opened' },
  { icon: '🗂',  label: 'Gallery', sub: 'From files', toast: '🗂 Gallery opened' },
  { icon: '🔗', label: 'URL',     sub: 'Paste link', toast: '🔗 URL import' },
]

function cardHover(e: MouseEvent, on: boolean): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.borderColor = on ? 'rgba(245,200,66,0.4)' : '#383532'
  btn.style.background  = on ? 'rgba(245,200,66,0.06)' : '#211f1b'
  btn.style.boxShadow   = on ? '0 0 14px rgba(245,200,66,0.1)' : 'none'
}
</script>
