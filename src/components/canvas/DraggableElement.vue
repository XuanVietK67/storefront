<template>
  <div
    ref="elRef"
    class="absolute cursor-grab select-none animate-pop-in origin-center"
    :class="{ 'outline outline-2 outline-accent outline-offset-[3px] rounded-[4px]': isSelected }"
    :style="{
      left: element.x + 'px',
      top:  element.y + 'px',
      transform: elementTransform,
      opacity: element.opacity,
      zIndex: isSelected ? 10 : 1,
    }"
    @mousedown="(e: MouseEvent) => onDragStart(e, element.x, element.y)"
    @touchstart="(e: TouchEvent) => onDragStart(e, element.x, element.y)"
    @click.stop="$emit('select', element.id)"
    @mouseenter="$emit('hint')"
  >
    <!-- Delete handle -->
    <div
      v-if="isSelected"
      class="absolute -top-[11px] -right-[11px] w-[21px] h-[21px] bg-danger border-2 border-app rounded-full flex items-center justify-center text-[11px] text-white cursor-pointer z-20"
      @click.stop="$emit('remove', element.id)"
    >
      ×
    </div>

    <!-- Content -->
    <span
      v-if="element.type === 'text'"
      class="text-[20px] whitespace-nowrap py-[2px] px-1 rounded-[3px] leading-[1.25]"
      :style="{
        color:      element.color,
        fontFamily: element.fontFamily,
        fontWeight: element.bold === false ? '400' : '700',
        textShadow: element.shadow ? '2px 3px 6px rgba(0,0,0,0.45)' : 'none',
      }"
    >{{ element.content }}</span>

    <span
      v-else-if="element.type === 'sticker'"
      class="text-[44px] leading-none block"
    >{{ element.content }}</span>

    <span
      v-else-if="element.type === 'icon'"
      class="text-[36px] leading-none block"
      :style="{ color: element.color }"
    >{{ element.content }}</span>

    <img
      v-else-if="element.type === 'image'"
      :src="element.content"
      class="block max-w-[120px] max-h-[120px] w-auto h-auto object-contain rounded-[4px]"
      :style="{ filter: imgFilter }"
      draggable="false"
    />

    <!-- Resize handle -->
    <div
      v-if="isSelected"
      class="absolute -bottom-2 -right-2 w-[15px] h-[15px] bg-accent border-2 border-app rounded-full cursor-se-resize"
      @mousedown.stop="onResizeStart"
      @touchstart.stop.passive="onResizeStart"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { makeDragHandlers, makeResizeHandlers } from '@/composables/useDrag'
import type { CanvasElement } from '@/types'

const props = defineProps<{
  element:    CanvasElement
  isSelected: boolean
  canvasEl:   HTMLElement | null
}>()

const emit = defineEmits<{
  select: [id: string]
  remove: [id: string]
  move:   [payload: { id: string; x: number; y: number }]
  resize: [payload: { id: string; scale: number }]
  hint:   []
}>()

const elementTransform = computed(() => {
  const el = props.element
  const sx = el.type === 'image' && el.flipX ? -el.scale : el.scale
  const sy = el.type === 'image' && el.flipY ? -el.scale : el.scale
  return `scaleX(${sx}) scaleY(${sy}) rotate(${el.rotation}deg)`
})

const imgFilter = computed(() => {
  const el = props.element
  if (el.type !== 'image') return 'none'
  const b  = el.brightness ?? 100
  const c  = el.contrast   ?? 100
  const s  = el.saturate   ?? 100
  const sp = el.sepia      ?? 0
  if (b === 100 && c === 100 && s === 100 && sp === 0) return 'none'
  return `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sp}%)`
})

const { onPointerDown: onDragStart } = makeDragHandlers(
  (x, y) => emit('move', { id: props.element.id, x, y }),
  ()     => emit('select', props.element.id),
  ()     => props.canvasEl,
)

const { onPointerDown: onResizeStart } = makeResizeHandlers(
  (scale) => emit('resize', { id: props.element.id, scale }),
  ()      => props.element.scale,
)
</script>
