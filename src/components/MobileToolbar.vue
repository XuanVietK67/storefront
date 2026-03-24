<template>
  <div
    class="flex md:hidden flex-shrink-0 h-[58px] px-2 items-center gap-1 overflow-x-auto scrollbar-none z-[100]"
    style="background: linear-gradient(180deg, #1e1c18 0%, #191714 100%); border-top: 1px solid #2c2a26; box-shadow: 0 -1px 0 rgba(255,255,255,0.03);"
  >
    <button
      v-for="item in tools"
      :key="item.key"
      class="relative flex flex-col items-center gap-[2px] px-[9px] py-[7px] rounded-[9px] flex-shrink-0 min-w-[56px] cursor-pointer text-[9px] font-syne font-bold uppercase tracking-[.04em] transition-all duration-200 overflow-hidden"
      :style="activePanel === item.panelId
        ? 'background: linear-gradient(135deg, #f7d44c, #e8a800); border: 1px solid transparent; color: #0f0e0c; box-shadow: 0 2px 12px rgba(245,200,66,0.4);'
        : 'background: #211f1b; border: 1px solid #2c2a26; color: #4a4845;'"
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
