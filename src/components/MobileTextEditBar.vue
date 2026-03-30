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
              class="absolute inset-0 flex items-center justify-center text-[9px] pointer-events-none"
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

      <!-- Row 4: font picker + style toggles + delete -->
      <div class="flex items-center gap-[5px]">
        <div class="flex-1 min-w-0">
          <FontPicker :modelValue="editFont" @update:modelValue="setFont" />
        </div>
        <button
          v-for="btn in styleButtons"
          :key="btn.key"
          class="flex-shrink-0 w-[30px] h-[30px] rounded-[7px] text-[13px] font-bold transition-all active:scale-90 flex items-center justify-center"
          :style="btn.active
            ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);border:1px solid transparent;color:#fff;box-shadow:0 2px 6px rgba(99,102,241,0.28);'
            : 'background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;'"
          @click="btn.toggle()"
        >
          <span :style="btn.labelStyle">{{ btn.label }}</span>
        </button>
        <button
          class="flex-shrink-0 w-[30px] h-[30px] rounded-[7px] text-[14px] transition-all active:scale-90 flex items-center justify-center"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @mouseenter="(e) => { const b = e.currentTarget as HTMLElement; b.style.background='#fef2f2'; b.style.borderColor='#fca5a5'; b.style.color='#d72c0d'; }"
          @mouseleave="(e) => { const b = e.currentTarget as HTMLElement; b.style.background='#f8fafc'; b.style.borderColor='#e2e8f0'; b.style.color='#64748b'; }"
          @click="deleteEl"
        >🗑</button>
      </div>

      <!-- Row 5: font size + letter spacing -->
      <div class="flex items-center gap-[5px]">
        <!-- Font size group -->
        <span class="text-[9px] font-syne font-bold tracking-wide uppercase flex-shrink-0" style="color:#94a3b8;">{{ t('textEdit.sizeDown')[0] }}a</span>
        <button
          class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[11px] active:scale-90 flex items-center justify-center"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @click="adjustFontSize(-2)"
        >{{ t('textEdit.sizeDown') }}</button>
        <span
          class="font-syne font-bold text-[11px] text-center flex-shrink-0"
          style="min-width:32px; color:#334155;"
        >{{ editFontSize }}px</span>
        <button
          class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[11px] active:scale-90 flex items-center justify-center"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @click="adjustFontSize(+2)"
        >{{ t('textEdit.sizeUp') }}</button>

        <div class="w-px h-[18px] flex-shrink-0 mx-[2px]" style="background:#e2e8f0;" />

        <!-- Letter spacing group -->
        <span class="text-[9px] font-syne font-bold tracking-wide uppercase flex-shrink-0" style="color:#94a3b8;">{{ t('textEdit.spacingLabel') }}</span>
        <button
          class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[14px] active:scale-90 flex items-center justify-center"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @click="adjustLetterSpacing(-1)"
        >−</button>
        <span
          class="font-syne font-bold text-[11px] text-center flex-shrink-0"
          style="min-width:20px; color:#334155;"
        >{{ editLetterSpacing }}</span>
        <button
          class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[14px] active:scale-90 flex items-center justify-center"
          style="background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;"
          @click="adjustLetterSpacing(+1)"
        >+</button>
      </div>

      <!-- Row 6: text effects strip -->
      <div class="flex items-center gap-[5px] overflow-x-auto scrollbar-none py-[1px]">
        <button
          v-for="eff in effectButtons"
          :key="eff.key"
          class="flex-shrink-0 flex items-center gap-[4px] h-[28px] px-[9px] rounded-full font-syne font-bold text-[10px] tracking-wide transition-all active:scale-95"
          :style="editTextEffect === eff.key
            ? 'background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;box-shadow:0 2px 6px rgba(99,102,241,0.28);'
            : 'background:#f1f5f9;border:1px solid #e2e8f0;color:#64748b;'"
          @click="toggleEffect(eff.key)"
        >
          <span class="text-[12px] leading-none">{{ eff.icon }}</span>
          <span>{{ eff.label }}</span>
        </button>
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

const inputRef         = ref<HTMLInputElement | null>(null)
const editText         = ref('')
const editColor        = ref('')
const editFont         = ref('Syne')
const editBold         = ref(true)
const editShadow       = ref(false)
const editFontSize     = ref(20)
const editLetterSpacing = ref(0)
const editTextDecoration = ref('')
const editTextEffect   = ref('')
let   snapshotSaved    = false

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
  editText.value          = el.content
  editColor.value         = el.color
  editFont.value          = el.fontFamily || 'Syne'
  editBold.value          = el.bold !== false
  editShadow.value        = el.shadow ?? false
  editFontSize.value      = el.fontSize ?? 20
  editLetterSpacing.value = el.letterSpacing ?? 0
  editTextDecoration.value = el.textDecoration ?? ''
  editTextEffect.value    = el.textEffect ?? ''
  snapshotSaved           = false
  nextTick(() => inputRef.value?.focus())
}, { immediate: true })

function ensureSnapshot(): void {
  if (!snapshotSaved) { saveUndo(); snapshotSaved = true }
}

// ── Canvas mutation helpers ───────────────────────────────────────────────────

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

function toggleDecoration(style: string): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  editTextDecoration.value = editTextDecoration.value === style ? '' : style
  updateEl(selectedEl.value.id, { textDecoration: editTextDecoration.value })
}

function adjustFontSize(delta: number): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  const next = Math.max(8, Math.min(72, editFontSize.value + delta))
  editFontSize.value = next
  updateEl(selectedEl.value.id, { fontSize: next })
}

function adjustLetterSpacing(delta: number): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  const next = Math.max(0, Math.min(20, editLetterSpacing.value + delta))
  editLetterSpacing.value = next
  updateEl(selectedEl.value.id, { letterSpacing: next })
}

function toggleEffect(key: string): void {
  if (!selectedEl.value) return
  ensureSnapshot()
  editTextEffect.value = editTextEffect.value === key ? '' : key
  updateEl(selectedEl.value.id, { textEffect: editTextEffect.value })
}

function deleteEl(): void {
  if (selectedEl.value) removeEl(selectedEl.value.id)
}

function done(): void {
  deselect()
}

// ── Computed button descriptors (locale-reactive) ────────────────────────────

const styleButtons = computed(() => [
  {
    key: 'bold',
    label: t('textEdit.bold'),
    labelStyle: 'font-weight:700;',
    active: editBold.value,
    toggle: toggleBold,
  },
  {
    key: 'shadow',
    label: t('textEdit.shadow'),
    labelStyle: 'text-shadow:1px 1px 2px rgba(0,0,0,0.4);',
    active: editShadow.value,
    toggle: toggleShadow,
  },
  {
    key: 'underline',
    label: t('panel.underline'),
    labelStyle: 'text-decoration:underline;',
    active: editTextDecoration.value === 'underline',
    toggle: () => toggleDecoration('underline'),
  },
  {
    key: 'strikethrough',
    label: t('panel.strikethrough'),
    labelStyle: 'text-decoration:line-through;',
    active: editTextDecoration.value === 'line-through',
    toggle: () => toggleDecoration('line-through'),
  },
])

const effectButtons = computed(() => [
  { key: 'outline',    icon: '◻',  label: t('panel.effectOutline') },
  { key: 'curved',     icon: '⌒',  label: t('panel.effectCurved') },
  { key: 'wave',       icon: '〜', label: t('panel.effectWave') },
  { key: '3d',         icon: '⬛', label: t('panel.effect3d') },
  { key: 'longshadow', icon: '◑',  label: t('panel.effectLongShadow') },
])
</script>
