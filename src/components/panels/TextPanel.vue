<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-2">
      <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.addText') }}</p>
      <div class="relative">
        <input
          v-model="textInput"
          type="text"
          :placeholder="t('panel.typeSomething')"
          maxlength="28"
          autocomplete="off"
          class="w-full rounded-[8px] pl-3 pr-14 py-[10px] text-sm outline-none transition-all duration-150 placeholder:text-faint"
          style="background:#f8fafc; border:1.5px solid #e2e8f0; color:#0f172a; caret-color:#6366f1;"
          @focus="(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'"
          @blur="(e) => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'"
          @keydown.enter="submit"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-syne tracking-wider text-faint border border-line rounded px-[5px] py-[2px] pointer-events-none select-none">↵</span>
      </div>
      <button
        class="group relative w-full h-[46px] rounded-[10px] font-dm font-semibold text-[14px] tracking-normal text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 hover:brightness-110 active:scale-[.97]"
        style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 4px 14px rgba(99,102,241,0.30);"
        @click="submit"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[10px]"
          style="background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);" />
        <span class="relative text-[16px] leading-none">✦</span>
        <span class="relative">{{ t('panel.add') }}</span>
      </button>
    </div>

    <div class="h-px bg-line" />

    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.color') }}</p>
    <ColorStrip v-model="color" />

    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.fontFamilies') }}</p>
    <FontPicker v-model="font" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ColorStrip from '@/components/ui/ColorStrip.vue'
import FontPicker from '@/components/ui/FontPicker.vue'
import { useCanvas } from '@/composables/useCanvas'

const { t } = useI18n()
const { addText, curColor, curFont, selectedEl, updateEl, saveUndo } = useCanvas()

const textInput     = ref<string>('')
const color         = ref<string>(curColor.value)
const font          = ref<string>(curFont.value)
const hovered       = ref<boolean>(false)
let   snapshotSaved = false

watch(selectedEl, el => {
  if (el?.type === 'text') { color.value = el.color; font.value = el.fontFamily || curFont.value }
  snapshotSaved = false
}, { immediate: true })

function ensureSnapshot(): void {
  if (!snapshotSaved) { saveUndo(); snapshotSaved = true }
}

watch(color, v => { curColor.value = v; if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { color: v }) } })
watch(font,  v => { curFont.value  = v; if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { fontFamily: v }) } })

function submit(): void { addText(textInput.value); textInput.value = '' }
</script>
