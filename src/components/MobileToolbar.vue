<template>
  <div
    class="flex md:hidden flex-shrink-0 h-[58px] px-2 items-center gap-1 overflow-x-auto scrollbar-none z-[100]"
    style="background: #ffffff; border-top: 1px solid #e2e8f0; box-shadow: 0 -4px 16px rgba(0,0,0,0.06);"
  >
    <button
      v-for="item in tools"
      :key="item.key"
      class="relative flex flex-col items-center gap-[3px] px-2.5 py-[7px] rounded-[10px] flex-shrink-0 min-w-[52px] cursor-pointer text-[9px] font-semibold uppercase tracking-[.06em] transition-all duration-150"
      :class="activePanel === item.panelId
        ? 'text-[#008060]'
        : 'text-slate-400 hover:text-slate-600'"
      :style="activePanel === item.panelId
        ? 'background: rgba(0,128,96,0.09); border: 1px solid rgba(0,128,96,0.2);'
        : 'background: transparent; border: 1px solid transparent;'"
      @click="$emit('toggle', item.panelId)"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        class="w-[20px] h-[20px] flex-shrink-0"
        stroke="currentColor"
        stroke-width="1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <template v-if="item.key === 'text'">
          <path d="M4 6h16M12 6v12M9 18h6"/>
        </template>
        <template v-else-if="item.key === 'image'">
          <path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </template>
        <template v-else-if="item.key === 'sticker'">
          <path d="M12 1l1.5 9.5L23 12l-9.5 1.5L12 23l-1.5-9.5L1 12l9.5-1.5z"/>
        </template>
        <template v-else-if="item.key === 'icon'">
          <rect x="4"  y="4"  width="6" height="6" rx="1.5"/>
          <rect x="14" y="4"  width="6" height="6" rx="1.5"/>
          <rect x="4"  y="14" width="6" height="6" rx="1.5"/>
          <rect x="14" y="14" width="6" height="6" rx="1.5"/>
        </template>
        <template v-else-if="item.key === 'adjust'">
          <path d="M3 6h18M3 12h18M3 18h18"/>
          <circle cx="8"  cy="6"  r="2.5" fill="white"/>
          <circle cx="16" cy="12" r="2.5" fill="white"/>
          <circle cx="10" cy="18" r="2.5" fill="white"/>
        </template>
      </svg>
      {{ item.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{ activePanel: string | null }>()
defineEmits(['toggle'])

const { t } = useI18n()

const tools = computed(() => [
  { key: 'text',    panelId: 'mp-text',    label: t('tools.text') },
  { key: 'image',   panelId: 'mp-image',   label: t('tools.image') },
  { key: 'sticker', panelId: 'mp-sticker', label: t('tools.sticker') },
  { key: 'icon',    panelId: 'mp-icon',    label: t('tools.icon') },
  { key: 'adjust',  panelId: 'mp-adjust',  label: t('tools.adjust') },
])
</script>
