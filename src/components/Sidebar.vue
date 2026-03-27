<template>
  <nav
    class="flex-shrink-0 w-[66px] flex flex-col items-center py-[10px] pb-[14px] gap-[2px] overflow-y-auto scrollbar-none"
    style="background: #ffffff; border-right: 1px solid #e8e5df; box-shadow: 2px 0 8px rgba(0,0,0,0.04);"
  >
    <template v-for="item in tools" :key="item.key ?? 'div'">
      <div
        v-if="item.divider"
        class="w-8 flex-shrink-0 my-1"
        style="height: 1px; background: linear-gradient(90deg, transparent, #d9d9d9, transparent);"
      />
      <button
        v-else
        class="relative w-[50px] py-[9px] px-1 pb-[7px] rounded-[10px] flex-shrink-0 flex flex-col items-center gap-[3px] cursor-pointer transition-all duration-200 text-[9px] font-syne font-bold tracking-[.04em] uppercase leading-[1.2] overflow-hidden"
        :class="activeTool === item.key
          ? 'text-accent'
          : 'text-faint hover:text-muted'"
        :style="activeTool === item.key
          ? 'background: rgba(0,128,96,0.08); border: 1px solid rgba(0,128,96,0.22); box-shadow: 0 2px 8px rgba(0,128,96,0.08);'
          : 'background: transparent; border: 1px solid transparent;'"
        @click="setTool(item.key!)"
      >
        <!-- Active left glow bar -->
        <span
          v-if="activeTool === item.key"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] rounded-r-full"
          style="height: 60%; background: linear-gradient(180deg, #008060, #00a37a); box-shadow: 0 0 6px rgba(0,128,96,0.4);"
        />
        <span class="text-[20px] leading-[1.1]">{{ item.icon }}</span>
        {{ item.label }}
      </button>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SidebarItem } from '@/types'

defineProps<{ activeTool: string }>()
const emit = defineEmits<{ setTool: [key: string] }>()

const { t } = useI18n()

const tools = computed<SidebarItem[]>(() => [
  { key: 'text',    icon: 'Ꭲ',  label: t('tools.text') },
  { key: 'image',   icon: '🖼',  label: t('tools.image') },
  { key: 'sticker', icon: '✨', label: t('tools.sticker') },
  { key: 'icon',    icon: '◈',  label: t('tools.icon') },
  { divider: true },
  { key: 'adjust',  icon: '⚡', label: t('tools.adjust') },
  { key: 'layers',  icon: '◧',  label: t('tools.layers') },
])

function setTool(key: string): void {
  emit('setTool', key)
}
</script>
