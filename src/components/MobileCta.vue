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
      class="group relative flex-1 h-[46px] rounded-[10px] font-syne font-extrabold text-[13px] tracking-wide text-app flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 active:scale-[.97]"
      style="background: linear-gradient(135deg, #f7d44c 0%, #f5c842 45%, #e8a800 100%); box-shadow: 0 4px 20px rgba(245,200,66,0.35), 0 2px 6px rgba(0,0,0,0.4);"
      @click="addToCart"
    >
      <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style="background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);" />
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
