<template>
  <div ref="triggerRef" class="relative w-full">

    <!-- Trigger — renders selected font in its own typeface -->
    <button
      class="w-full flex items-center justify-between gap-2 px-3 py-[9px] rounded-sm border bg-surface2 text-sm text-fore transition-all"
      :style="{
        fontFamily:  modelValue,
        borderColor: open ? '#008060' : '#d9d9d9',
        boxShadow:   open ? '0 0 0 2px rgba(0,128,96,0.14)' : 'none',
      }"
      @click="toggle"
    >
      <span class="truncate">{{ modelValue }}</span>
      <span
        class="flex-shrink-0 text-[10px] text-faint"
        style="transition: transform 150ms;"
        :style="{ transform: open ? 'rotate(180deg)' : 'none' }"
      >▾</span>
    </button>

    <!-- Teleported dropdown — escapes overflow/scroll containers -->
    <Teleport to="body">

      <!-- Backdrop -->
      <div v-if="open" class="fixed inset-0 z-40" @click="open = false" />

      <!-- Categorized font list -->
      <div
        v-if="open"
        class="fixed z-50 overflow-y-auto rounded-[8px]"
        :style="{
          top:       dropTop  + 'px',
          left:      dropLeft + 'px',
          width:     dropWidth + 'px',
          maxHeight: '300px',
          background:  '#ffffff',
          border:      '1px solid #d9d9d9',
          boxShadow:   '0 8px 28px rgba(0,0,0,0.13)',
        }"
      >
        <template v-for="cat in FONT_CATEGORIES" :key="cat.label">

          <!-- Category header (sticky so it stays visible while scrolling) -->
          <div
            class="sticky top-0 px-3 py-[5px] text-[9px] font-syne font-bold tracking-[.10em] uppercase select-none"
            style="background: #f6f6f1; color: #a8a8a8; border-bottom: 1px solid #ebebeb; z-index: 1;"
          >{{ cat.label }}</div>

          <!-- Font rows -->
          <button
            v-for="font in cat.fonts"
            :key="font"
            class="w-full text-left px-3 py-[8px] text-[13px] leading-snug transition-colors"
            :style="{
              fontFamily: font,
              background: modelValue === font ? 'rgba(0,128,96,0.08)' : 'transparent',
              color:      modelValue === font ? '#008060'             : '#1a1a1a',
              fontWeight: modelValue === font ? '600'                 : '400',
            }"
            @mouseenter="(e) => { if (modelValue !== font) (e.currentTarget as HTMLElement).style.background = 'rgba(0,128,96,0.04)' }"
            @mouseleave="(e) => { if (modelValue !== font) (e.currentTarget as HTMLElement).style.background = 'transparent' }"
            @click="select(font)"
          >
            <!-- Name in the font itself + small meta label -->
            <span>{{ font }}</span>
            <span
              v-if="modelValue === font"
              class="ml-2 text-[9px] font-syne tracking-wide"
              style="font-family: Syne; color: #008060; opacity: 0.75;"
            >✓</span>
          </button>

        </template>
      </div>

    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FONT_CATEGORIES } from '@/constants'

defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const triggerRef = ref<HTMLElement | null>(null)
const open       = ref(false)
const dropTop    = ref(0)
const dropLeft   = ref(0)
const dropWidth  = ref(200)

function toggle(): void {
  if (!open.value) {
    const rect = triggerRef.value?.getBoundingClientRect()
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom
      dropTop.value   = spaceBelow >= 300 ? rect.bottom + 4 : rect.top - 304
      dropLeft.value  = rect.left
      dropWidth.value = Math.max(rect.width, 190)
    }
  }
  open.value = !open.value
}

function select(font: string): void {
  emit('update:modelValue', font)
  open.value = false
}
</script>
