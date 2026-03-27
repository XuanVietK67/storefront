<template>
  <div
    class="flex md:hidden flex-shrink-0 items-center gap-2 px-3 safe-pb"
    style="background: #ffffff; border-top: 1px solid #e2e8f0; padding-top: 10px; box-shadow: 0 -2px 16px rgba(99,102,241,0.08);"
  >
    <button
      class="flex-shrink-0 h-[46px] px-4 rounded-[10px] font-syne font-semibold text-[12px] tracking-wide transition-all duration-150 active:scale-[.97]"
      style="background: #f1f5f9; border: 1px solid #e2e8f0; color: #64748b;"
      @mouseenter="(e) => { const b = e.currentTarget as HTMLElement; b.style.borderColor = '#cbd5e1'; b.style.color = '#0f172a'; b.style.background = '#e8eeff'; }"
      @mouseleave="(e) => { const b = e.currentTarget as HTMLElement; b.style.borderColor = '#e2e8f0'; b.style.color = '#64748b'; b.style.background = '#f1f5f9'; }"
      @click="showToast(t('toast.preview'))"
    >{{ t('panel.preview') }}</button>

    <button
      class="group relative flex-1 h-[46px] rounded-[10px] font-dm font-semibold text-[14px] tracking-normal text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 hover:brightness-110 active:scale-[.97]"
      style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 4px 14px rgba(99,102,241,0.30);"
      @click="addToCart"
    >
      <span class="relative">🛒</span>
      <span class="relative">{{ t('panel.addToCart') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCanvas } from '@/composables/useCanvas'
import { useToast }  from '@/composables/useToast'

const { t } = useI18n()
const { addToCart } = useCanvas()
const { showToast } = useToast()
</script>
