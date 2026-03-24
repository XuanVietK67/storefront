<template>
  <div
    class="flex md:hidden flex-shrink-0 flex-col px-3 pt-[10px] gap-[8px] safe-pb"
    style="background: #ffffff; border-top: 2px solid #008060; box-shadow: 0 -4px 16px rgba(0,0,0,0.07);"
  >
    <!-- Header label -->
    <div class="flex items-center gap-2">
      <span class="text-[10px] font-syne font-bold tracking-[.10em] uppercase text-accent flex-1">
        ✏ Editing Text
      </span>
      <span class="text-[10px] font-dm text-faint">tap Done when finished</span>
    </div>

    <!-- Row 1: text input + Done button -->
    <div class="flex items-center gap-2">
      <input
        ref="inputRef"
        v-model="editText"
        type="text"
        maxlength="28"
        autocomplete="off"
        placeholder="Type your text…"
        class="flex-1 bg-surface2 border border-line rounded-sm px-3 py-[9px] text-sm text-fore placeholder:text-faint outline-none transition-colors focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,128,96,0.14)]"
        @input="onTextInput"
      />
      <button
        class="flex-shrink-0 h-[38px] px-4 rounded-[8px] font-dm font-semibold text-[13px] text-white transition-all active:scale-[.96] hover:bg-[#2a2a2a]"
        style="background: #1a1a1a; box-shadow: 0 2px 6px rgba(0,0,0,0.12);"
        @click="done"
      >
        Done
      </button>
    </div>

    <!-- Row 2: color swatches + size controls + delete -->
    <div class="flex items-center gap-[6px] pb-[4px]">

      <!-- Color swatches (scrollable) -->
      <div class="flex gap-[5px] flex-1 overflow-x-auto scrollbar-none">
        <button
          v-for="c in COLORS"
          :key="c"
          class="w-[24px] h-[24px] rounded-full flex-shrink-0 transition-all duration-100 active:scale-110"
          :style="{
            background: c,
            border: editColor === c ? '2px solid #008060' : c === '#ffffff' ? '2px solid #d9d9d9' : '2px solid transparent',
            transform: editColor === c ? 'scale(1.25)' : 'scale(1)',
            boxShadow: editColor === c
              ? '0 0 0 2px rgba(0,128,96,0.20), 0 1px 4px rgba(0,0,0,0.12)'
              : '0 1px 3px rgba(0,0,0,0.12)',
          }"
          @click="setColor(c)"
        />
      </div>

      <!-- Divider -->
      <div class="flex-shrink-0 w-px h-6" style="background: #d9d9d9;" />

      <!-- Size decrease -->
      <button
        class="flex-shrink-0 w-[32px] h-[32px] rounded-[7px] flex items-center justify-center font-dm font-bold text-[11px] transition-all active:scale-90"
        style="background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d;"
        @click="adjustSize(-0.15)"
      >A−</button>

      <!-- Size increase -->
      <button
        class="flex-shrink-0 w-[32px] h-[32px] rounded-[7px] flex items-center justify-center font-dm font-bold text-[11px] transition-all active:scale-90"
        style="background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d;"
        @click="adjustSize(+0.15)"
      >A+</button>

      <!-- Divider -->
      <div class="flex-shrink-0 w-px h-6" style="background: #d9d9d9;" />

      <!-- Delete -->
      <button
        class="flex-shrink-0 w-[32px] h-[32px] rounded-[7px] flex items-center justify-center text-[15px] transition-all active:scale-90"
        style="background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d;"
        @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.background = '#fef2f2'; (e.currentTarget as HTMLElement).style.borderColor = '#fca5a5'; (e.currentTarget as HTMLElement).style.color = '#d72c0d'; }"
        @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.background = '#f1f1f1'; (e.currentTarget as HTMLElement).style.borderColor = '#d9d9d9'; (e.currentTarget as HTMLElement).style.color = '#6d6d6d'; }"
        @click="deleteEl"
      >🗑</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { COLORS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'

const { selectedEl, updateEl, removeEl, deselect, saveUndo } = useCanvas()

const inputRef  = ref<HTMLInputElement | null>(null)
const editText  = ref('')
const editColor = ref('')
let   snapshotSaved = false

// Sync local state when the selected text element changes
watch(selectedEl, (el) => {
  if (!el || el.type !== 'text') return
  editText.value  = el.content
  editColor.value = el.color
  snapshotSaved   = false
  nextTick(() => inputRef.value?.focus())
}, { immediate: true })

// Save one undo snapshot the first time the user makes a change in this session
function ensureSnapshot(): void {
  if (!snapshotSaved) {
    saveUndo()
    snapshotSaved = true
  }
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
