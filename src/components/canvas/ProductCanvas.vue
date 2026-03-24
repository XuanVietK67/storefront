<template>
  <div
    class="relative flex-shrink-0 rounded-[18px] overflow-visible"
    :style="{
      width:  canvasWidth + 'px',
      height: canvasHeight + 'px',
      boxShadow: '0 0 0 1px rgba(255,255,255,.06), 0 44px 120px rgba(0,0,0,.85), 0 0 100px rgba(245,200,66,.05)',
    }"
  >
    <!-- Layer count badge -->
    <div
      class="absolute -top-[13px] left-0 rounded-[20px] px-[10px] py-[2px] text-[9px] font-syne font-bold border backdrop-blur-sm pointer-events-none transition-all duration-200 z-[5]"
      :class="elements.length
        ? 'text-accent border-accent/[.28] bg-app/90'
        : 'text-faint border-line bg-app/90'"
    >
      {{ elements.length }} {{ elements.length === 1 ? 'layer' : 'layers' }}
    </div>

    <!-- Canvas inner (scaled for zoom) -->
    <div
      ref="cvInnerRef"
      class="w-full h-full rounded-[18px] overflow-hidden relative"
      :style="{ transform: `scale(${canvasScale})`, transformOrigin: 'top left' }"
    >
      <BagSvg />

      <!-- Overlay: draggable elements -->
      <div
        class="absolute inset-0 rounded-[18px] z-[2]"
        @click.self="$emit('deselect')"
      >
        <DraggableElement
          v-for="el in elements"
          :key="el.id"
          :element="el"
          :is-selected="el.id === selectedId"
          :canvas-el="cvInnerRef"
          @select="$emit('select', $event)"
          @remove="$emit('remove', $event)"
          @move="$emit('move', $event)"
          @resize="$emit('resize', $event)"
          @hint="showHint"
        />
      </div>
    </div>

    <!-- Hover hint -->
    <div
      class="absolute -bottom-[38px] left-1/2 -translate-x-1/2 bg-[rgba(18,17,14,.93)] border border-line text-faint text-[10px] font-syne tracking-[.06em] px-3 py-[3px] rounded-[20px] whitespace-nowrap backdrop-blur-[10px] pointer-events-none transition-opacity duration-300"
      :class="hintVisible ? 'opacity-100' : 'opacity-0'"
    >
      TAP TO SELECT · DRAG · RESIZE
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BagSvg from './BagSvg.vue'
import DraggableElement from './DraggableElement.vue'
import { CANVAS_SIZE } from '@/constants'

const props = defineProps({
  elements:    { type: Array,  required: true },
  selectedId:  { type: String, default: null },
  canvasScale: { type: Number, default: 1 },
  canvasWidth: { type: Number, required: true },
  canvasHeight:{ type: Number, required: true },
})

defineEmits(['select', 'remove', 'move', 'resize', 'deselect'])

const cvInnerRef = ref(null)
const hintVisible = ref(false)
let hintTimer = null

function showHint() {
  hintVisible.value = true
  clearTimeout(hintTimer)
  hintTimer = setTimeout(() => { hintVisible.value = false }, 1400)
}
</script>
