<template>
  <header
    class="flex-shrink-0 h-[54px] flex items-center px-[14px] gap-[10px] z-[200] flex-shrink-0"
    style="background: #ffffff; border-bottom: 1px solid #e8e5df; box-shadow: 0 1px 8px rgba(0,0,0,0.06);"
  >
    <!-- Logo -->
    <!-- <div class="font-syne text-[17px] font-extrabold tracking-[-0.04em] whitespace-nowrap flex-shrink-0 text-fore">
      Custom<em
        class="not-italic"
        style="color: #008060;"
      >Maker</em>
    </div> -->

    <!-- Breadcrumb (tablet+) -->
    <!-- <div class="hidden md:flex flex-1 items-center gap-2 overflow-hidden">
      <span class="text-faint text-xs">›</span>
      <span
        class="text-[11px] font-syne font-semibold tracking-wide text-muted overflow-hidden text-ellipsis whitespace-nowrap px-2 py-[3px] rounded-md"
        style="background: #f1f1f1; border: 1px solid #d9d9d9;"
      >
        Classic Canvas Tote — Natural
      </span>
    </div> -->

    <!-- Actions -->
    <div class="flex gap-[5px] ml-auto items-center flex-shrink-0">
      <span class="hidden xl:inline-flex text-[9px] text-faint font-syne tracking-[.05em] border border-line bg-surface2 rounded-[5px] px-[7px] py-[3px] whitespace-nowrap">
        Ctrl+Z · Ctrl+Y · Del
      </span>

      <button
        class="group w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0"
        style="background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d;"
        title="Undo (Ctrl+Z)"
        @click="undo"
        @mouseenter="(e) => applyHover(e, false)"
        @mouseleave="(e) => removeHover(e)"
      >↩</button>

      <button
        class="group w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0"
        style="background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d;"
        title="Redo (Ctrl+Y)"
        @click="redo"
        @mouseenter="(e) => applyHover(e, false)"
        @mouseleave="(e) => removeHover(e)"
      >↪</button>

      <button
        class="w-[34px] h-[34px] rounded-lg flex items-center justify-center cursor-pointer text-[15px] select-none transition-all duration-150 flex-shrink-0 hover:!border-danger/40 hover:!bg-danger/10 hover:!text-danger active:scale-90"
        style="background: #f1f1f1; border: 1px solid #d9d9d9; color: #6d6d6d;"
        title="Clear all"
        @click="doClear"
      >🗑</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'

const { undo, redo, doClear } = useCanvas()

function applyHover(e: MouseEvent, _danger: boolean): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.background = '#e8e8e1'
  btn.style.color = '#1a1a1a'
}
function removeHover(e: MouseEvent): void {
  const btn = e.currentTarget as HTMLElement
  btn.style.background = '#f1f1f1'
  btn.style.color = '#6d6d6d'
}
</script>
