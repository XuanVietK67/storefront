<template>
  <aside
    class="flex-shrink-0 w-[268px] flex flex-col overflow-hidden"
    style="background: #ffffff; border-left: 1px solid #e8e5df; box-shadow: -2px 0 8px rgba(0,0,0,0.04);"
  >
    <!-- Header -->
    <div
      class="px-4 pt-[14px] pb-[11px] flex-shrink-0"
      style="border-bottom: 1px solid #d9d9d9; background: #ffffff;"
    >
      <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint mb-[3px]">Design Tools</p>
      <h2
        class="font-syne text-[16px] font-extrabold tracking-[-0.03em] leading-tight"
        style="background: linear-gradient(135deg, #1a1916 30%, #706d69); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
      >
        {{ TOOL_NAMES[activeTool] || activeTool }}
      </h2>
    </div>

    <!-- Scrollable panel content -->
    <div class="flex-1 overflow-y-auto px-4 py-[14px] flex flex-col gap-4">
      <TextPanel    v-if="activeTool === 'text'" />
      <ImagePanel   v-else-if="activeTool === 'image'" />
      <StickerPanel v-else-if="activeTool === 'sticker'" />
      <IconPanel    v-else-if="activeTool === 'icon'" />
      <AdjustPanel  v-else-if="activeTool === 'adjust'" />
      <LayersPanel  v-else-if="activeTool === 'layers'" />
    </div>

    <!-- Cart CTA -->
    <div
      class="px-4 pt-[14px] safe-pb flex-shrink-0"
      style="border-top: 1px solid #d9d9d9; background: #ffffff;"
    >
      <!-- Price row -->
      <div class="flex items-end justify-between mb-3">
        <span class="text-[11px] font-syne tracking-wide uppercase text-faint">Your total</span>
        <div class="text-right">
          <span
            class="font-syne text-[22px] font-extrabold tracking-[-0.04em] leading-none"
            style="background: linear-gradient(135deg, #1a1916, #706d69); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
          >$34.99</span>
          <span class="block text-[10px] text-faint font-syne tracking-wide">+ personalization</span>
        </div>
      </div>

      <!-- Add to Cart button -->
      <button
        class="group relative w-full h-[48px] rounded-[11px] font-dm font-semibold text-[14px] tracking-normal text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 hover:bg-[#2a2a2a] active:scale-[.97] mb-[2px]"
        style="background: #1a1a1a; box-shadow: 0 2px 8px rgba(0,0,0,0.14);"
        @click="addToCart"
      >
        <span class="relative text-[17px] leading-none">🛒</span>
        <span class="relative">Add to Cart</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import TextPanel    from '@/components/panels/TextPanel.vue'
import ImagePanel   from '@/components/panels/ImagePanel.vue'
import StickerPanel from '@/components/panels/StickerPanel.vue'
import IconPanel    from '@/components/panels/IconPanel.vue'
import AdjustPanel  from '@/components/panels/AdjustPanel.vue'
import LayersPanel  from '@/components/panels/LayersPanel.vue'
import { TOOL_NAMES } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'

defineProps<{ activeTool: string }>()

const { addToCart } = useCanvas()
</script>
