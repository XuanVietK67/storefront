<template>
  <div
    class="flex md:hidden flex-shrink-0 h-[58px] px-2 items-center gap-1 overflow-x-auto scrollbar-none z-[100]"
    style="background: #ffffff; border-top: 1px solid #e8e5df; box-shadow: 0 -4px 16px rgba(0,0,0,0.06);"
  >
    <button
      v-for="item in tools"
      :key="item.key"
      class="relative flex flex-col items-center gap-[2px] px-[9px] py-[7px] rounded-[9px] flex-shrink-0 min-w-[56px] cursor-pointer text-[9px] font-syne font-bold uppercase tracking-[.04em] transition-all duration-200 overflow-hidden"
      :style="activePanel === item.panelId
        ? 'background: #1a1a1a; border: 1px solid transparent; color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.14);'
        : 'background: #f1f1f1; border: 1px solid #d9d9d9; color: #a8a8a8;'"
      @click="$emit('toggle', item.panelId)"
    >
      <span class="text-[19px] leading-[1.1]">{{ item.icon }}</span>
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{ activePanel: string | null }>()
defineEmits(['toggle'])

const tools = [
  { key: 'text',    panelId: 'mp-text',    icon: 'Ꭲ',  label: 'Text' },
  { key: 'image',   panelId: 'mp-image',   icon: '🖼',  label: 'Image' },
  { key: 'sticker', panelId: 'mp-sticker', icon: '✨', label: 'Sticker' },
  { key: 'icon',    panelId: 'mp-icon',    icon: '◈',  label: 'Icon' },
  { key: 'adjust',  panelId: 'mp-adjust',  icon: '⚡', label: 'Adjust' },
]
</script>
