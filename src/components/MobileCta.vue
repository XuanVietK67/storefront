<template>
  <div
    class="flex md:hidden flex-shrink-0 items-center gap-2 px-3 safe-pb"
    style="background: #ffffff; border-top: 1px solid #e8e5df; padding-top: 10px; box-shadow: 0 -2px 12px rgba(0,0,0,0.05);"
  >
    <!-- Preview button (glass style) -->
    <button
      class="flex-shrink-0 h-[46px] px-4 rounded-[10px] font-syne font-semibold text-[12px] tracking-wide transition-all duration-150 active:scale-[.97]"
      style="background: #f3f1ec; border: 1px solid #d8d5cf; color: #706d69;"
      @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#a09d99'; (e.currentTarget as HTMLElement).style.color = '#1a1916'; }"
      @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#d8d5cf'; (e.currentTarget as HTMLElement).style.color = '#706d69'; }"
      @click="showToast('👀 Preview')"
    >
      Preview
    </button>

    <!-- Cart button (gradient) -->
    <button
      class="group relative flex-1 h-[46px] rounded-[10px] font-dm font-semibold text-[14px] tracking-normal text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 hover:bg-[#2a2a2a] active:scale-[.97]"
      style="background: #1a1a1a; box-shadow: 0 2px 8px rgba(0,0,0,0.14);"
      @click="addToCart"
    >
      <span class="relative">🛒</span>
      <span class="relative">Add to Cart · $34.99</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCanvas } from '@/composables/useCanvas'
import { useToast }  from '@/composables/useToast'

const { addToCart } = useCanvas()
const { showToast } = useToast()
</script>
