<template>
  <div
    class="flex md:hidden flex-shrink-0 flex-col gap-0"
    style="background: #ffffff; border-top: 2px solid #6366f1; box-shadow: 0 -4px 20px rgba(99,102,241,0.10);"
  >
    <div class="flex flex-col gap-[8px] px-3 pt-[10px] pb-[12px]">

      <!-- Row 1: label -->
      <div class="flex items-center gap-2">
        <span class="text-[9px] font-syne font-bold tracking-[.10em] uppercase" style="color:#6366f1;">{{ t('textEdit.editing') }}</span>
        <div class="flex-1 h-px" style="background:#e2e8f0;" />
      </div>

      <!-- Row 2: text input + Done -->
      <div class="flex items-center gap-2">
        <input
          ref="inputRef"
          v-model="editText"
          type="text"
          maxlength="28"
          autocomplete="off"
          :placeholder="t('textEdit.placeholder')"
          class="flex-1 rounded-[8px] px-3 py-[9px] text-sm outline-none transition-all"
          style="background:#f8fafc; border:1.5px solid #e2e8f0; color:#0f172a; caret-color:#6366f1;"
          @focus="(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'"
          @blur="(e) => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'"
          @input="onTextInput"
        />
        <button
          class="flex-shrink-0 h-[38px] px-4 rounded-[8px] font-dm font-semibold text-[13px] text-white transition-all active:scale-[.95] hover:brightness-110"
          style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 3px 10px rgba(99,102,241,0.28);"
          @click="done"
        >{{ t('textEdit.done') }}</button>
      </div>

      <!-- Row 3: color strip -->
      <div class="flex items-center gap-[6px] overflow-x-auto scrollbar-none py-[1px]">
        <!-- Color picker trigger -->
        <label class="relative flex-shrink-0 cursor-pointer group" :title="t('textEdit.pickColor')">
          <span
            class="block w-[28px] h-[28px] rounded-[6px] transition-all duration-100 group-hover:scale-110"
            :style="{
              background: editColor,
              border:     isColorPreset ? '2px dashed #6366f1' : '2px solid #6366f1',
              boxShadow:  isColorPreset ? '0 0 0 2px rgba(99,102,241,0.15)' : '0 0 0 2px rgba(99,102,241,0.28)',
            }"
          >
            <span
              class="absolute inset-0 flex items-center justify-center text-[9px] pointer-events-none transition-opacity"
              :style="{ color: isColorLight(editColor) ? '#1a1a1a' : '#ffffff', opacity: isColorPreset ? '0.6' : '1' }"
            >✎</span>
          </span>
          <input
            type="color"
            :value="editColor"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            @input="setColor(($event.target as HTMLInputElement).value)"
          />
        </label>
        <!-- Preset swatches -->
        <button
          v-for="c in COLORS"
          :key="c"
          class="w-[24px] h-[24px] rounded-full flex-shrink-0 transition-all duration-100 active:scale-110"
          :style="{
            background: c,
            border:     editColor === c ? '2px solid #6366f1' : c === '#ffffff' ? '2px solid #d9d9d9' : '2px solid transparent',
            transform:  editColor === c ? 'scale(1.22)' : 'scale(1)',
            boxShadow:  editColor === c ? '0 0 0 2px rgba(99,102,241,0.22)' : '0 1px 3px rgba(0,0,0,.12)',
          }"
          @click="setColor(c)"
        />
      </div>

      <!-- Row 4: font picker + style buttons + size + delete -->
      <div class="flex items-center gap-[6px]">
        <!-- Font picker (takes remaining space) -->
        <div class="flex-1 min-w-0">
          <FontPicker :modelValue="editFont" @update:modelValue="setFont" />
        </div>
        <!-- Bold -->
        <button
          class="flex-shrink-0 w-[34px] h-[34px] rounded-[7px] text-[14px] font-bold transition-all active:scale-90"
          :style="editBold
            ? 'background: linear-gradient(135deg,#6366f1,#4f46e5); border:1px solid transparent; color:#ffffff; box-shadow:0 2px 6px rgba(99,102,241,0.28);'
            : 'background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;'"
          @click="toggleBold"
        >B</button>
        <!-- Shadow -->
        <button
          class="flex-shrink-0 w-[34px] h-[34px] rounded-[7px] text-[13px] font-bold transition-all active:scale-90"
          :style="editShadow
            ? 'background: linear-gradient(135deg,#6366f1,#4f46e5); border:1px solid transparent; color:#ffffff; box-shadow:0 2px 6px rgba(99,102,241,0.28); text-shadow:1px 2px 4px rgba(255,255,255,0.30);'
            : 'background:#f8fafc; border:1px solid #e2e8f0; color:#64748b; text-shadow:1px 2px 3px rgba(0,0,0,0.18);'"
          @click="toggleShadow"
        >S</button>
        <!-- Size − -->
        <button
          class="flex-shrink-0 w-[34px] h-[34px] rounded-[7px] font-dm font-bold text-[12px] transition-all active:scale-90"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @click="adjustSize(-0.15)"
        >A−</button>
        <!-- Size + -->
        <button
          class="flex-shrink-0 w-[34px] h-[34px] rounded-[7px] font-dm font-bold text-[12px] transition-all active:scale-90"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @click="adjustSize(+0.15)"
        >A+</button>
        <!-- Delete -->
        <button
          class="flex-shrink-0 w-[34px] h-[34px] rounded-[7px] text-[15px] transition-all active:scale-90"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @mouseenter="(e) => { const b = e.currentTarget as HTMLElement; b.style.background='#fef2f2'; b.style.borderColor='#fca5a5'; b.style.color='#d72c0d'; }"
          @mouseleave="(e) => { const b = e.currentTarget as HTMLElement; b.style.background='#f8fafc'; b.style.borderColor='#e2e8f0'; b.style.color='#64748b'; }"
          @click="deleteEl"
        >🗑</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { COLORS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'
import FontPicker from '@/components/ui/FontPicker.vue'

const { t } = useI18n()
const { selectedEl, updateEl, removeEl, deselect, saveUndo } = useCanvas()

const inputRef   = ref<HTMLInputElement | null>(null)
const editText   = ref('')
const editColor  = ref('')
const editFont   = ref('Syne')
const editBold   = ref(true)
const editShadow = ref(false)
let   snapshotSaved = false

const isColorPreset = computed(() => COLORS.includes(editColor.value))

function isColorLight(hex: string): boolean {
  if (!hex || hex.length < 7) return true
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

watch(selectedEl, (el) => {
  if (!el || el.type !== 'text') return
  editText.value   = el.content
  editColor.value  = el.color
  editFont.value   = el.fontFamily || 'Syne'
  editBold.value   = el.bold !== false
  editShadow.value = el.shadow ?? false
  snapshotSaved    = false
  nextTick(() => inputRef.value?.focus())
}, { immediate: true })

function ensureSnapshot(): void {
  if (!snapshotSaved) { saveUndo(); snapshotSaved = true }
}

function onTextInput(): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  updateEl(selectedEl.value.id, { content: editText.value })
}

function setColor(c: string): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  editColor.value = c
  updateEl(selectedEl.value.id, { color: c })
}

function setFont(font: string): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  editFont.value = font
  updateEl(selectedEl.value.id, { fontFamily: font })
}

function toggleBold(): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  editBold.value = !editBold.value
  updateEl(selectedEl.value.id, { bold: editBold.value })
}

function toggleShadow(): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  editShadow.value = !editShadow.value
  updateEl(selectedEl.value.id, { shadow: editShadow.value })
}

function adjustSize(delta: number): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  const next = Math.max(0.25, Math.min(4, (selectedEl.value.scale ?? 1) + delta))
  updateEl(selectedEl.value.id, { scale: next })
}

function deleteEl(): void {
  if (selectedEl.value) removeEl(selectedEl.value.id)
}

function done(): void {
  deselect()
}
</script>
