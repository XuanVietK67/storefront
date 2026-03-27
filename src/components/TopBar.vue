<template>
  <header
    class="flex-shrink-0 h-[54px] flex items-center px-[14px] gap-[10px] z-[200] flex-shrink-0"
    style="background: #ffffff; border-bottom: 1px solid #e2e8f0; box-shadow: 0 1px 10px rgba(99,102,241,0.07);"
  >
    <!-- Actions -->
    <div class="flex gap-[5px] ml-auto items-center flex-shrink-0">
      <span class="hidden xl:inline-flex text-[9px] text-faint font-syne tracking-[.05em] border border-line bg-surface3 rounded-[5px] px-[7px] py-[3px] whitespace-nowrap">
        {{ t('nav.shortcuts') }}
      </span>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        :title="t('nav.undo')"
        @click="undo"
        @mouseenter="(e) => applyHover(e)"
        @mouseleave="(e) => removeHover(e)"
      >↩</button>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        :title="t('nav.redo')"
        @click="redo"
        @mouseenter="(e) => applyHover(e)"
        @mouseleave="(e) => removeHover(e)"
      >↪</button>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0 hover:!border-danger/40 hover:!bg-danger/10 hover:!text-danger active:scale-90"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        :title="t('nav.clearAll')"
        @click="doClear"
      >🗑</button>

      <div class="w-px h-[20px] flex-shrink-0" style="background: #e2e8f0;" />

      <button
        class="h-[34px] px-[10px] rounded-lg flex items-center gap-[5px] cursor-pointer text-[11px] font-syne font-bold select-none transition-all duration-150 flex-shrink-0 active:scale-95"
        style="background: #008060; border: 1px solid #008060; color: #ffffff;"
        :title="t('nav.saveTitle')"
        @click="saveDesign"
        @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.background = '#006b50'; (e.currentTarget as HTMLElement).style.borderColor = '#006b50' }"
        @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.background = '#008060'; (e.currentTarget as HTMLElement).style.borderColor = '#008060' }"
      >
        <span>💾</span>
        <span class="hidden sm:inline">{{ t('nav.save') }}</span>
      </button>

      <button
        class="h-[34px] px-[10px] rounded-lg flex items-center gap-[5px] cursor-pointer text-[11px] font-syne font-bold select-none transition-all duration-150 flex-shrink-0 active:scale-95"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        :title="t('nav.loadTitle')"
        @click="loadDesign"
        @mouseenter="(e) => applyHover(e)"
        @mouseleave="(e) => removeHover(e)"
      >
        <span>📂</span>
        <span class="hidden sm:inline">{{ t('nav.load') }}</span>
      </button>

      <div class="w-px h-[20px] flex-shrink-0" style="background: #e2e8f0;" />

      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import { useCanvas } from '@/composables/useCanvas'

const { t } = useI18n()
const { undo, redo, doClear, saveDesign, loadDesign } = useCanvas()

function applyHover(e: MouseEvent): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.background = '#e8eeff'
  btn.style.borderColor = '#c7d2fe'
  btn.style.color = '#4f46e5'
}
function removeHover(e: MouseEvent): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.background = '#ffffff'
  btn.style.borderColor = '#e2e8f0'
  btn.style.color = '#64748b'
}
</script>
