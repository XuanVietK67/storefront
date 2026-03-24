<template>
  <div class="flex items-center gap-3">
    <span class="text-[11px] font-syne font-semibold tracking-wide text-muted w-[46px] flex-shrink-0">{{ label }}</span>
    <input
      type="range"
      class="flex-1"
      :min="min"
      :max="max"
      :value="modelValue"
      @input="$emit('update:modelValue', Number(($event.target as HTMLInputElement).value))"
    />
    <span
      class="text-[11px] font-syne font-bold w-9 text-right flex-shrink-0"
      style="background: linear-gradient(135deg, #f7d44c, #e8a800); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
    >
      {{ displayValue }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label:        string
  modelValue:   number
  min:          number
  max:          number
  displayValue: string
}>()
defineEmits(['update:modelValue'])
</script>
