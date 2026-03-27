<template>
  <Teleport to="body">
    <div
      v-if="cropOpen"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center p-4"
      style="background: rgba(0,0,0,0.88);"
      @click.self="closeCrop"
    >
      <div class="flex flex-col gap-3 w-full" style="max-width: 420px;">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <span class="text-white text-[14px] font-bold font-syne">Crop Image</span>
          <button
            class="text-white text-[24px] leading-none opacity-60 hover:opacity-100"
            @click="closeCrop"
          >×</button>
        </div>

        <!-- Crop canvas -->
        <canvas
          ref="cropCanvas"
          class="block w-full rounded-xl touch-none"
          style="cursor: crosshair; max-height: 60vh;"
          @mousedown="(e) => onCropDown(e.clientX, e.clientY)"
          @mousemove="(e) => onCropMove(e.clientX, e.clientY)"
          @mouseup="onCropUp"
          @mouseleave="onCropUp"
          @touchstart.prevent="(e) => onCropDown(e.touches[0].clientX, e.touches[0].clientY)"
          @touchmove.prevent="(e) => onCropMove(e.touches[0].clientX, e.touches[0].clientY)"
          @touchend="onCropUp"
        />

        <!-- Hint -->
        <p class="text-center text-[10px] font-syne" style="color: rgba(255,255,255,0.45);">
          Drag corners to resize · drag inside to move
        </p>

        <!-- Actions -->
        <div class="flex gap-2">
          <button
            class="flex-1 py-[10px] rounded-[9px] text-[13px] font-bold text-white active:opacity-75"
            style="background: #475569;"
            @click="closeCrop"
          >Cancel</button>
          <button
            class="flex-1 py-[10px] rounded-[9px] text-[13px] font-bold text-white active:opacity-75"
            style="background: #008060;"
            @click="confirmCrop"
          >✓ Apply Crop</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, nextTick } from 'vue'
import { useCrop } from '@/composables/useCrop'

const {
  cropOpen, cropCanvas,
  closeCrop, initCropCanvas,
  onCropDown, onCropMove, onCropUp, confirmCrop,
} = useCrop()

watch(cropOpen, async (open) => {
  if (open) {
    await nextTick()
    initCropCanvas()
  }
})
</script>
