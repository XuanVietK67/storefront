<template>
  <div class="flex flex-wrap gap-[6px]">
    <button
      v-for="color in COLORS"
      :key="color"
      class="relative w-7 h-7 rounded-full flex-shrink-0 cursor-pointer transition-all duration-150"
      :style="{
        background: color,
        border: modelValue === color
          ? '2px solid #008060'
          : color === '#ffffff' ? '2px solid #d9d9d9' : '2px solid transparent',
        transform: modelValue === color ? 'scale(1.25)' : 'scale(1)',
        boxShadow: modelValue === color
          ? '0 0 0 3px rgba(0,128,96,0.18), 0 2px 6px rgba(0,0,0,0.15)'
          : '0 1px 3px rgba(0,0,0,0.12)',
      }"
      :title="color"
      @click="$emit('update:modelValue', color)"
    >
      <!-- Checkmark on selected -->
      <span
        v-if="modelValue === color"
        class="absolute inset-0 flex items-center justify-center text-[10px] font-bold pointer-events-none"
        :style="{ color: isLight(color) ? '#1a1a1a' : '#ffffff' }"
      >✓</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { COLORS } from '@/constants'

defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])

function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
</script>
