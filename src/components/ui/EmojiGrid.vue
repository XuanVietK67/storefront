<template>
  <div
    class="flex gap-[5px]"
    :class="inline ? 'overflow-x-auto scrollbar-none' : 'flex-wrap'"
  >
    <button
      v-for="item in items"
      :key="item"
      class="group w-[42px] h-[42px] rounded-[9px] text-[21px] flex items-center justify-center cursor-pointer transition-all duration-150 flex-shrink-0 active:scale-90"
      style="background: #f1f1f1; border: 1px solid #d9d9d9; box-shadow: 0 1px 3px rgba(0,0,0,0.06);"
      @mouseenter="(e) => hoverOn(e)"
      @mouseleave="(e) => hoverOff(e)"
      @click="$emit('pick', item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items:  string[]
  inline: boolean
}>()
defineEmits(['pick'])

function hoverOn(e: MouseEvent): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.borderColor = 'rgba(0,128,96,0.40)'
  btn.style.background  = 'rgba(0,128,96,0.08)'
  btn.style.boxShadow   = '0 2px 8px rgba(0,128,96,0.12)'
  btn.style.transform   = 'scale(1.1)'
}
function hoverOff(e: MouseEvent): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.borderColor = '#d9d9d9'
  btn.style.background  = '#f1f1f1'
  btn.style.boxShadow   = '0 1px 3px rgba(0,0,0,0.06)'
  btn.style.transform   = 'scale(1)'
}
</script>
