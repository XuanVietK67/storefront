<template>
  <div
    class="flex md:hidden flex-shrink-0 h-[58px] px-2 items-center gap-1 overflow-x-auto scrollbar-none z-[100]"
    style="background: #ffffff; border-top: 1px solid #e2e8f0; box-shadow: 0 -4px 16px rgba(99,102,241,0.07);"
  >
    <button
      v-for="item in tools"
      :key="item.key"
      class="relative flex flex-col items-center gap-[2px] px-[9px] py-[7px] rounded-[9px] flex-shrink-0 min-w-[56px] cursor-pointer text-[9px] font-syne font-bold uppercase tracking-[.04em] transition-all duration-200 overflow-hidden"
      :style="activePanel === item.panelId
        ? 'background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: 1px solid transparent; color: #ffffff; box-shadow: 0 3px 10px rgba(99,102,241,0.30);'
        : 'background: #ffffff; border: 1px solid #e2e8f0; color: #94a3b8;'"
      @click="$emit('toggle', item.panelId)"
    >
      <span class="text-[19px] leading-[1.1]">{{ item.icon }}</span>
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
  { key: 'text',    panelId: 'mp-text',    icon: 'Ꭲ',  label: t('tools.text') },
  { key: 'image',   panelId: 'mp-image',   icon: '🖼',  label: t('tools.image') },
  { key: 'sticker', panelId: 'mp-sticker', icon: '✨', label: t('tools.sticker') },
  { key: 'icon',    panelId: 'mp-icon',    icon: '◈',  label: t('tools.icon') },
  { key: 'adjust',  panelId: 'mp-adjust',  icon: '⚡', label: t('tools.adjust') },
])
</script>
