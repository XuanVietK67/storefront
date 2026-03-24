<template>
  <div class="flex flex-wrap gap-[5px]">
    <button
      v-for="font in FONTS"
      :key="font"
      class="px-3 py-[5px] rounded-[20px] flex-shrink-0 text-[12px] cursor-pointer transition-all duration-150"
      :style="modelValue === font
        ? `font-family: ${font}; background: linear-gradient(135deg, #f7d44c, #e8a800); border: 1px solid transparent; color: #0f0e0c; font-weight: 700; box-shadow: 0 2px 10px rgba(245,200,66,0.35);`
        : `font-family: ${font}; background: #211f1b; border: 1px solid #2c2a26; color: #8a8680; font-weight: 400;`"
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
