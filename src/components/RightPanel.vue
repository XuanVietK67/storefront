<template>
  <aside
    class="flex-shrink-0 w-[268px] flex flex-col overflow-hidden"
    style="background: linear-gradient(180deg, #1e1c18 0%, #191714 100%); border-left: 1px solid #2c2a26;"
  >
    <!-- Header -->
    <div
      class="px-4 pt-[14px] pb-[11px] flex-shrink-0"
      style="border-bottom: 1px solid #2c2a26; background: linear-gradient(180deg, rgba(245,200,66,0.04) 0%, transparent 100%);"
    >
      <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint mb-[3px]">Design Tools</p>
      <h2
        class="font-syne text-[16px] font-extrabold tracking-[-0.03em] leading-tight"
        style="background: linear-gradient(135deg, #f0ede6 30%, #a09a90); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
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
      style="border-top: 1px solid #2c2a26; background: linear-gradient(0deg, rgba(245,200,66,0.04) 0%, transparent 100%);"
    >
      <!-- Price row -->
      <div class="flex items-end justify-between mb-3">
        <span class="text-[11px] font-syne tracking-wide uppercase text-faint">Your total</span>
        <div class="text-right">
          <span
            class="font-syne text-[22px] font-extrabold tracking-[-0.04em] leading-none"
            style="background: linear-gradient(135deg, #f0ede6, #c8c4bc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;"
          >$34.99</span>
          <span class="block text-[10px] text-faint font-syne tracking-wide">+ personalization</span>
        </div>
      </div>

      <!-- Add to Cart button -->
      <button
        class="group relative w-full h-[48px] rounded-[11px] font-syne font-extrabold text-[13px] tracking-wide text-app flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 active:scale-[.97] mb-[2px]"
        style="background: linear-gradient(135deg, #f7d44c 0%, #f5c842 45%, #e8a800 100%); box-shadow: 0 4px 24px rgba(245,200,66,0.4), 0 2px 6px rgba(0,0,0,0.5);"
        @click="addToCart"
      >
        <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style="background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);" />
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
