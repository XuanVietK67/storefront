<template>
  <div class="flex flex-wrap gap-[5px]">
    <button
      v-for="font in FONTS"
      :key="font"
      class="px-3 py-[5px] rounded-[20px] flex-shrink-0 text-[12px] cursor-pointer transition-all duration-150"
      :style="modelValue === font
        ? `font-family: ${font}; background: #1a1a1a; border: 1px solid transparent; color: #ffffff; font-weight: 600; box-shadow: 0 2px 8px rgba(0,0,0,0.14);`
        : `font-family: ${font}; background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d; font-weight: 400;`"
      @click="$emit('update:modelValue', font)"
    >
      {{ font }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { FONTS } from '@/constants'

defineProps<{ modelValue: string }>()
defineEmits(['update:modelValue'])
</script>
