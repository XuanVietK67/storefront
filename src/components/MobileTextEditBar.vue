<template>
  <div
    class="flex md:hidden flex-shrink-0 flex-col"
    style="background: #ffffff; border-top: 2px solid #008060; box-shadow: 0 -4px 16px rgba(0,0,0,0.07);"
  >
    <!-- Fixed top: label + input + Done -->
    <div class="flex flex-col gap-[6px] px-3 pt-[10px] pb-[8px]">
      <div class="flex items-center gap-2">
        <span class="text-[9px] font-syne font-bold tracking-[.10em] uppercase text-accent">✏ Editing Text</span>
        <div class="flex-1 h-px bg-line" />
        <span class="text-[9px] font-dm text-faint">swipe for more →</span>
      </div>
      <div class="flex items-center gap-2">
        <input
          ref="inputRef"
          v-model="editText"
          type="text"
          maxlength="28"
          autocomplete="off"
          placeholder="Type your text…"
          class="flex-1 bg-surface2 border border-line rounded-sm px-3 py-[8px] text-sm text-fore placeholder:text-faint outline-none transition-colors focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,128,96,0.14)]"
          @input="onTextInput"
        />
        <button
          class="flex-shrink-0 h-[36px] px-4 rounded-[7px] font-dm font-semibold text-[13px] text-white transition-all active:scale-[.95] hover:bg-[#2a2a2a]"
          style="background: #1a1a1a;"
          @click="done"
        >Done</button>
      </div>
    </div>

    <!-- Horizontally scrollable formatting strip -->
    <div class="flex items-end overflow-x-auto scrollbar-none px-3 pb-[10px] gap-0 safe-pb">

      <!-- ── COLOR ── -->
      <div class="flex flex-col gap-[5px] flex-shrink-0 pr-3">
        <span class="text-[9px] font-syne font-bold tracking-[.08em] uppercase text-faint">Color</span>
        <div class="flex items-center gap-[5px]">

          <!-- Native color picker trigger -->
          <label class="relative flex-shrink-0 cursor-pointer group" title="Pick any color">
            <span
              class="block w-[28px] h-[28px] rounded-[6px] transition-all duration-100 group-hover:scale-110"
              :style="{
                background: editColor,
                border:     isColorPreset ? '2px dashed #008060' : '2px solid #008060',
                boxShadow:  isColorPreset
                  ? '0 0 0 2px rgba(0,128,96,0.15), 0 1px 3px rgba(0,0,0,0.10)'
                  : '0 0 0 2px rgba(0,128,96,0.25)',
              }"
            >
              <span
                class="absolute inset-0 flex items-center justify-center text-[9px] pointer-events-none transition-opacity"
                :style="{
                  color:   isColorLight(editColor) ? '#1a1a1a' : '#ffffff',
                  opacity: isColorPreset ? '0.55' : '1',
                }"
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
              border:     editColor === c ? '2px solid #008060' : c === '#ffffff' ? '2px solid #d9d9d9' : '2px solid transparent',
              transform:  editColor === c ? 'scale(1.22)' : 'scale(1)',
              boxShadow:  editColor === c ? '0 0 0 2px rgba(0,128,96,0.20)' : '0 1px 3px rgba(0,0,0,.12)',
            }"
            @click="setColor(c)"
          />
        </div>
      </div>

      <div class="flex-shrink-0 w-px self-stretch mx-2" style="background:#d9d9d9;" />

      <!-- ── FONT FAMILY ── -->
      <div class="flex flex-col gap-[5px] flex-shrink-0 px-1" style="width: 148px;">
        <span class="text-[9px] font-syne font-bold tracking-[.08em] uppercase text-faint">Font</span>
        <FontPicker :modelValue="editFont" @update:modelValue="setFont" />
      </div>

      <div class="flex-shrink-0 w-px self-stretch mx-2" style="background:#d9d9d9;" />

      <!-- ── STYLE: Bold + Shadow ── -->
      <div class="flex flex-col gap-[5px] flex-shrink-0 px-1">
        <span class="text-[9px] font-syne font-bold tracking-[.08em] uppercase text-faint">Style</span>
        <div class="flex items-center gap-[4px]">
          <!-- Bold toggle — label weight previews the effect -->
          <button
            class="flex-shrink-0 w-[36px] h-[28px] rounded-[6px] text-[14px] transition-all active:scale-90"
            :style="editBold
              ? 'background:#1a1a1a; border:1px solid transparent; color:#ffffff; font-weight:800;'
              : 'background:#f1f1f1; border:1px solid #d9d9d9;  color:#6d6d6d;  font-weight:400;'"
            @click="toggleBold"
          >B</button>
          <!-- Shadow toggle — label carries a drop shadow to preview the effect -->
          <button
            class="flex-shrink-0 w-[36px] h-[28px] rounded-[6px] text-[13px] font-bold transition-all active:scale-90"
            :style="editShadow
              ? 'background:#1a1a1a; border:1px solid transparent; color:#ffffff; text-shadow:1px 2px 4px rgba(255,255,255,0.30);'
              : 'background:#f1f1f1; border:1px solid #d9d9d9;  color:#6d6d6d;  text-shadow:1px 2px 3px rgba(0,0,0,0.25);'"
            @click="toggleShadow"
          >S</button>
        </div>
      </div>

      <div class="flex-shrink-0 w-px self-stretch mx-2" style="background:#d9d9d9;" />

      <!-- ── SIZE ── -->
      <div class="flex flex-col gap-[5px] flex-shrink-0 px-1">
        <span class="text-[9px] font-syne font-bold tracking-[.08em] uppercase text-faint">Size</span>
        <div class="flex items-center gap-[4px]">
          <button
            class="flex-shrink-0 w-[36px] h-[28px] rounded-[6px] font-dm font-bold text-[11px] transition-all active:scale-90"
            style="background:#f1f1f1; border:1px solid #d9d9d9; color:#6d6d6d;"
            @click="adjustSize(-0.15)"
          >A−</button>
          <button
            class="flex-shrink-0 w-[36px] h-[28px] rounded-[6px] font-dm font-bold text-[11px] transition-all active:scale-90"
            style="background:#f1f1f1; border:1px solid #d9d9d9; color:#6d6d6d;"
            @click="adjustSize(+0.15)"
          >A+</button>
        </div>
      </div>

      <div class="flex-shrink-0 w-px self-stretch mx-2" style="background:#d9d9d9;" />

      <!-- ── DELETE ── -->
      <div class="flex flex-col gap-[5px] flex-shrink-0 pl-1">
        <!-- invisible label keeps vertical alignment -->
        <span class="text-[9px] opacity-0 select-none">·</span>
        <button
          class="flex-shrink-0 w-[36px] h-[28px] rounded-[6px] text-[15px] transition-all active:scale-90"
          style="background:#f1f1f1; border:1px solid #d9d9d9; color:#6d6d6d;"
          @mouseenter="(e) => { const b = e.currentTarget as HTMLElement; b.style.background='#fef2f2'; b.style.borderColor='#fca5a5'; b.style.color='#d72c0d'; }"
          @mouseleave="(e) => { const b = e.currentTarget as HTMLElement; b.style.background='#f1f1f1'; b.style.borderColor='#d9d9d9'; b.style.color='#6d6d6d'; }"
          @click="deleteEl"
        >🗑</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { COLORS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'
import FontPicker from '@/components/ui/FontPicker.vue'

const { selectedEl, updateEl, removeEl, deselect, saveUndo } = useCanvas()

const inputRef   = ref<HTMLInputElement | null>(null)
const editText   = ref('')
const editColor  = ref('')
const editFont   = ref('Syne')
const editBold   = ref(true)
const editShadow = ref(false)
let   snapshotSaved = false

// True when the current color is one of the presets
const isColorPreset = computed(() => COLORS.includes(editColor.value))

function isColorLight(hex: string): boolean {
  if (!hex || hex.length < 7) return true
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}

// Sync all local state when a text element is selected
watch(selectedEl, (el) => {
  if (!el || el.type !== 'text') return
  editText.value   = el.content
  editColor.value  = el.color
  editFont.value   = el.fontFamily || 'Syne'
  editBold.value   = el.bold !== false          // true by default (backwards-compatible)
  editShadow.value = el.shadow ?? false
  snapshotSaved    = false
  nextTick(() => inputRef.value?.focus())
}, { immediate: true })

// Take one undo snapshot before the first mutation in each edit session
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
