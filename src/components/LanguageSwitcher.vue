<template>
  <div class="relative flex-shrink-0" ref="containerRef">
    <!-- Trigger button -->
    <button
      class="h-[34px] px-[9px] rounded-lg flex items-center gap-[5px] cursor-pointer text-[11px] font-syne font-bold select-none transition-all duration-150 active:scale-95"
      style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
      :title="t('lang.label')"
      @click="open = !open"
      @mouseenter="(e) => applyHover(e as MouseEvent)"
      @mouseleave="(e) => removeHover(e as MouseEvent)"
    >
      <span class="text-[15px] leading-none">{{ currentFlag }}</span>
      <span class="hidden sm:inline">{{ t(`lang.${locale}`) }}</span>
      <span class="text-[9px] opacity-50">▾</span>
    </button>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute right-0 top-[38px] z-[300] flex flex-col overflow-hidden rounded-[10px] py-1"
      style="background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 8px 24px rgba(0,0,0,0.10); min-width: 148px;"
    >
      <button
        v-for="loc in LOCALES"
        :key="loc.code"
        class="flex items-center gap-[9px] px-[12px] py-[8px] text-[12px] font-syne font-bold text-left transition-colors duration-100 cursor-pointer"
        :style="locale === loc.code
          ? 'background: rgba(0,128,96,0.08); color: #008060;'
          : 'background: transparent; color: #374151;'"
        @mouseenter="(e) => (e.currentTarget as HTMLElement).style.background = locale === loc.code ? 'rgba(0,128,96,0.12)' : '#f8fafc'"
        @mouseleave="(e) => (e.currentTarget as HTMLElement).style.background = locale === loc.code ? 'rgba(0,128,96,0.08)' : 'transparent'"
        @click="select(loc.code)"
      >
        <span class="text-[16px] leading-none flex-shrink-0">{{ loc.flag }}</span>
        <span>{{ t(`lang.${loc.code}`) }}</span>
        <span v-if="locale === loc.code" class="ml-auto text-[10px]">✓</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, LOCALES } from '@/i18n'

const { t, locale } = useI18n()

const open = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const currentFlag = computed(
  () => LOCALES.find(l => l.code === locale.value)?.flag ?? '🌐',
)

function select(code: string): void {
  setLocale(code)
  open.value = false
}

function onClickOutside(e: MouseEvent): void {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))

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
