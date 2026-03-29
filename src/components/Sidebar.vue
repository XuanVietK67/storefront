<template>
  <nav
    class="flex-shrink-0 w-[68px] flex flex-col items-center py-3 pb-4 gap-0.5 overflow-y-auto scrollbar-none"
    style="background: #ffffff; border-right: 1px solid #e8e5df; box-shadow: 2px 0 8px rgba(0,0,0,0.04);"
  >
    <template v-for="item in tools" :key="item.key ?? 'div'">
      <div
        v-if="item.divider"
        class="w-9 flex-shrink-0 my-2"
        style="height: 1px; background: linear-gradient(90deg, transparent, #d0cfc9, transparent);"
      />
      <button
        v-else
        class="relative w-[54px] py-2.5 rounded-xl flex-shrink-0 flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-150 text-[9px] font-semibold tracking-[.07em] uppercase leading-none"
        :class="activeTool === item.key
          ? 'text-[#008060]'
          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'"
        :style="activeTool === item.key
          ? 'background: rgba(0,128,96,0.08);'
          : ''"
        @click="setTool(item.key!)"
      >
        <!-- Active left indicator bar -->
        <span
          v-if="activeTool === item.key"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full"
          style="height: 54%; background: #008060; box-shadow: 0 0 6px rgba(0,128,96,0.45);"
        />

        <!-- SVG icon — rendered by key -->
        <svg
          viewBox="0 0 24 24"
          fill="none"
          class="w-[22px] h-[22px] flex-shrink-0"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <!-- Text: bold T letter with baseline -->
          <template v-if="item.key === 'text'">
            <path d="M4 6h16M12 6v12M9 18h6"/>
          </template>

          <!-- Image: camera with circular lens -->
          <template v-else-if="item.key === 'image'">
            <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </template>

          <!-- Sticker: 4-pointed sparkle -->
          <template v-else-if="item.key === 'sticker'">
            <path d="M12 1l1.5 9.5L23 12l-9.5 1.5L12 23l-1.5-9.5L1 12l9.5-1.5z"/>
          </template>

          <!-- Icon: 2×2 grid of squares -->
          <template v-else-if="item.key === 'icon'">
            <rect x="4"  y="4"  width="6" height="6" rx="1.5"/>
            <rect x="14" y="4"  width="6" height="6" rx="1.5"/>
            <rect x="4"  y="14" width="6" height="6" rx="1.5"/>
            <rect x="14" y="14" width="6" height="6" rx="1.5"/>
          </template>

          <!-- Adjust: 3 horizontal slider tracks with knobs -->
          <template v-else-if="item.key === 'adjust'">
            <path d="M3 6h18M3 12h18M3 18h18"/>
            <circle cx="8"  cy="6"  r="2.5" fill="white"/>
            <circle cx="16" cy="12" r="2.5" fill="white"/>
            <circle cx="10" cy="18" r="2.5" fill="white"/>
          </template>

          <!-- Layers: stacked 3D diamond layers -->
          <template v-else-if="item.key === 'layers'">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 12l10 5 10-5M2 17l10 5 10-5"/>
          </template>
        </svg>

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
  { key: 'text',    icon: 'text',    label: t('tools.text') },
  { key: 'image',   icon: 'image',   label: t('tools.image') },
  { key: 'sticker', icon: 'sticker', label: t('tools.sticker') },
  { key: 'icon',    icon: 'icon',    label: t('tools.icon') },
  { divider: true },
  { key: 'adjust',  icon: 'adjust',  label: t('tools.adjust') },
  { key: 'layers',  icon: 'layers',  label: t('tools.layers') },
])

function setTool(key: string): void {
  emit('setTool', key)
}
</script>
