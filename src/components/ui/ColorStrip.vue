<template>
  <div class="flex flex-wrap items-center gap-[6px]">

    <!-- Native color picker trigger — shows current color, glows green when a custom color is active -->
    <label class="relative flex-shrink-0 cursor-pointer group" title="Pick any color">
      <span
        class="block w-8 h-8 rounded-[7px] transition-all duration-150 group-hover:scale-110"
        :style="{
          background: modelValue,
          border:     isPreset ? '2px dashed #008060' : '2px solid #008060',
          boxShadow:  isPreset
            ? '0 0 0 2px rgba(0,128,96,0.15), 0 1px 3px rgba(0,0,0,0.10)'
            : '0 0 0 3px rgba(0,128,96,0.25), 0 2px 6px rgba(0,0,0,0.12)',
        }"
      >
        <!-- Pencil icon — always visible, stronger when custom color active -->
        <span
          class="absolute inset-0 flex items-center justify-center text-[11px] pointer-events-none transition-opacity"
          :style="{
            color:   isLight(modelValue) ? '#1a1a1a' : '#ffffff',
            opacity: isPreset ? '0.55' : '1',
          }"
        >✎</span>
      </span>
      <input
        type="color"
        :value="modelValue"
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <!-- Preset swatches -->
    <button
      v-for="color in COLORS"
      :key="color"
      class="relative w-7 h-7 rounded-full flex-shrink-0 cursor-pointer transition-all duration-150"
      :style="{
        background: color,
        border:     modelValue === color
          ? '2px solid #008060'
          : color === '#ffffff' ? '2px solid #d9d9d9' : '2px solid transparent',
        transform:  modelValue === color ? 'scale(1.25)' : 'scale(1)',
        boxShadow:  modelValue === color
          ? '0 0 0 3px rgba(0,128,96,0.18), 0 2px 6px rgba(0,0,0,0.15)'
          : '0 1px 3px rgba(0,0,0,0.12)',
      }"
      :title="color"
      @click="$emit('update:modelValue', color)"
    >
      <span
        v-if="modelValue === color"
        class="absolute inset-0 flex items-center justify-center text-[10px] font-bold pointer-events-none"
        :style="{ color: isLight(color) ? '#1a1a1a' : '#ffffff' }"
      >✓</span>
    </button>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { COLORS } from '@/constants'

const props = defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])

const isPreset = computed(() => COLORS.includes(props.modelValue))

function isLight(hex: string): boolean {
  if (!hex || hex.length < 7) return true
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
</script>
