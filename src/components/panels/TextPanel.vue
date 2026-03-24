<template>
  <div class="flex flex-col gap-3">

    <!-- Input group -->
    <div class="flex flex-col gap-2">
      <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">Your text</p>

      <!-- Input with Enter hint -->
      <div class="relative">
        <input
          v-model="textInput"
          type="text"
          placeholder="Type something…"
          maxlength="28"
          autocomplete="off"
          class="w-full bg-surface2 border border-line rounded-sm pl-3 pr-14 py-[10px] text-sm text-fore placeholder:text-faint outline-none transition-all duration-150 focus:border-accent focus:bg-surface3 focus:shadow-[0_0_0_3px_rgba(245,200,66,0.12)]"
          @keydown.enter="submit"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-syne tracking-wider text-faint border border-line rounded px-[5px] py-[2px] pointer-events-none select-none">
          ↵
        </span>
      </div>

      <!-- Add to Canvas button -->
      <button
        class="group relative w-full h-[46px] rounded-[10px] font-syne font-extrabold text-[13px] tracking-wide text-app flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 active:scale-[.97]"
        style="background: linear-gradient(135deg, #f7d44c 0%, #f5c842 45%, #e8a800 100%); box-shadow: 0 4px 20px rgba(245,200,66,0.35), 0 1px 4px rgba(0,0,0,0.4);"
        @click="submit"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <!-- Shimmer overlay -->
        <span
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[10px]"
          style="background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%); background-size: 200% 100%;"
        />
        <span class="relative text-[16px] leading-none">✦</span>
        <span class="relative">Add to Canvas</span>
      </button>
    </div>

    <!-- Divider -->
    <div class="h-px bg-line" />

    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">Color</p>
    <ColorStrip v-model="color" />

    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">Font</p>
    <FontChips v-model="font" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ColorStrip from '@/components/ui/ColorStrip.vue'
import FontChips  from '@/components/ui/FontChips.vue'
import { useCanvas } from '@/composables/useCanvas'

const { addText, curColor, curFont } = useCanvas()

const textInput = ref<string>('')
const color     = ref<string>(curColor.value)
const font      = ref<string>(curFont.value)
const hovered   = ref<boolean>(false)

watch(color, v => { curColor.value = v })
watch(font,  v => { curFont.value  = v })

function submit(): void {
  addText(textInput.value)
  textInput.value = ''
}
</script>
