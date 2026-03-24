<template>
  <div
    class="flex gap-[5px]"
    :class="inline ? 'overflow-x-auto scrollbar-none' : 'flex-wrap'"
  >
    <button
      v-for="item in items"
      :key="item"
      class="group w-[42px] h-[42px] rounded-[9px] text-[21px] flex items-center justify-center cursor-pointer transition-all duration-150 flex-shrink-0 active:scale-90"
      style="background: #211f1b; border: 1px solid #2c2a26; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"
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
  btn.style.borderColor = 'rgba(245,200,66,0.5)'
  btn.style.background  = 'rgba(245,200,66,0.1)'
  btn.style.boxShadow   = '0 0 10px rgba(245,200,66,0.15)'
  btn.style.transform   = 'scale(1.1)'
}
function hoverOff(e: MouseEvent): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.borderColor = '#2c2a26'
  btn.style.background  = '#211f1b'
  btn.style.boxShadow   = '0 1px 3px rgba(0,0,0,0.3)'
  btn.style.transform   = 'scale(1)'
}
</script>
