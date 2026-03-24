<template>
  <nav
    class="flex-shrink-0 w-[66px] flex flex-col items-center py-[10px] pb-[14px] gap-[2px] overflow-y-auto scrollbar-none"
    style="background: linear-gradient(180deg, #1e1c18 0%, #191714 100%); border-right: 1px solid #2c2a26;"
  >
    <template v-for="item in tools" :key="item.key ?? 'div'">
      <div
        v-if="item.divider"
        class="w-8 flex-shrink-0 my-1"
        style="height: 1px; background: linear-gradient(90deg, transparent, #2c2a26, transparent);"
      />
      <button
        v-else
        class="relative w-[50px] py-[9px] px-1 pb-[7px] rounded-[10px] flex-shrink-0 flex flex-col items-center gap-[3px] cursor-pointer transition-all duration-200 text-[9px] font-syne font-bold tracking-[.04em] uppercase leading-[1.2] overflow-hidden"
        :class="activeTool === item.key
          ? 'text-accent'
          : 'text-faint hover:text-muted'"
        :style="activeTool === item.key
          ? 'background: linear-gradient(145deg, rgba(245,200,66,0.18), rgba(245,200,66,0.06)); border: 1px solid rgba(245,200,66,0.25); box-shadow: 0 0 12px rgba(245,200,66,0.08) inset;'
          : 'background: transparent; border: 1px solid transparent;'"
        @click="setTool(item.key!)"
      >
        <!-- Active left glow bar -->
        <span
          v-if="activeTool === item.key"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-r-full"
          style="height: 60%; background: linear-gradient(180deg, #f7d44c, #e8a800); box-shadow: 0 0 6px rgba(245,200,66,0.6);"
        />
        <span class="text-[20px] leading-[1.1]">{{ item.icon }}</span>
        {{ item.label }}
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import type { SidebarItem } from '@/types'

defineProps<{ activeTool: string }>()
const emit = defineEmits<{ setTool: [key: string] }>()

const tools: SidebarItem[] = [
  { key: 'text',    icon: 'Ꭲ',  label: 'Text' },
  { key: 'image',   icon: '🖼',  label: 'Image' },
  { key: 'sticker', icon: '✨', label: 'Sticker' },
  { key: 'icon',    icon: '◈',  label: 'Icon' },
  { divider: true },
  { key: 'adjust',  icon: '⚡', label: 'Adjust' },
  { key: 'layers',  icon: '◧',  label: 'Layers' },
]

function setTool(key: string): void {
  emit('setTool', key)
}
</script>
