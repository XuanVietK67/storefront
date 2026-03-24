<template>
  <header
    class="flex-shrink-0 h-[54px] flex items-center px-[14px] gap-[10px] z-[200] flex-shrink-0"
    style="background: #ffffff; border-bottom: 1px solid #e2e8f0; box-shadow: 0 1px 10px rgba(99,102,241,0.07);"
  >
    <!-- Actions -->
    <div class="flex gap-[5px] ml-auto items-center flex-shrink-0">
      <span class="hidden xl:inline-flex text-[9px] text-faint font-syne tracking-[.05em] border border-line bg-surface3 rounded-[5px] px-[7px] py-[3px] whitespace-nowrap">
        Ctrl+Z · Ctrl+Y · Del
      </span>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        title="Undo (Ctrl+Z)"
        @click="undo"
        @mouseenter="(e) => applyHover(e)"
        @mouseleave="(e) => removeHover(e)"
      >↩</button>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        title="Redo (Ctrl+Y)"
        @click="redo"
        @mouseenter="(e) => applyHover(e)"
        @mouseleave="(e) => removeHover(e)"
      >↪</button>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0 hover:!border-danger/40 hover:!bg-danger/10 hover:!text-danger active:scale-90"
        style="background: #ffffff; border: 1px solid #e2e8f0; color: #64748b;"
        title="Clear all"
        @click="doClear"
      >🗑</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'

const { undo, redo, doClear } = useCanvas()

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
