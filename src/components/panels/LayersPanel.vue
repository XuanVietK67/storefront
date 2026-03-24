<template>
  <div class="flex flex-col gap-2">
    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Layer stack</p>

    <!-- Empty state -->
    <div
      v-if="!reversedLayers.length"
      class="rounded-[10px] py-6 flex flex-col items-center gap-2"
      style="background: #211f1b; border: 1px dashed #383532;"
    >
      <span class="text-[28px]">◧</span>
      <p class="text-[11px] font-syne text-faint text-center">No layers yet<br>Add something to get started</p>
    </div>

    <!-- Layer items -->
    <div
      v-for="(el, i) in reversedLayers"
      :key="el.id"
      class="group flex items-center gap-2 px-[10px] py-[8px] rounded-[9px] cursor-pointer transition-all duration-150"
      :style="selectedId === el.id
        ? 'background: rgba(245,200,66,0.1); border: 1px solid rgba(245,200,66,0.35); box-shadow: 0 0 12px rgba(245,200,66,0.08);'
        : 'background: #211f1b; border: 1px solid #2c2a26;'"
      @click="selectEl(el.id)"
    >
      <!-- Layer number badge -->
      <span
        class="flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-syne font-bold"
        :style="selectedId === el.id
          ? 'background: rgba(245,200,66,0.2); color: #f5c842;'
          : 'background: #2a2824; color: #8a8680;'"
      >{{ reversedLayers.length - i }}</span>

      <!-- Icon / text thumb -->
      <span class="text-[15px] flex-shrink-0 w-5 text-center">
        {{ el.type === 'text' ? '𝗧' : el.content.slice(0, 2) }}
      </span>

      <!-- Name -->
      <span
        class="flex-1 text-xs font-syne font-medium"
        :style="selectedId === el.id ? 'color: #f0ede6;' : 'color: #8a8680;'"
      >
        {{ capitalize(el.type) }}
      </span>

      <!-- Delete -->
      <button
        class="opacity-0 group-hover:opacity-100 w-5 h-5 rounded flex items-center justify-center text-[12px] transition-all duration-150 hover:!bg-danger/20 hover:!text-danger flex-shrink-0"
        style="color: #4a4845; background: transparent;"
        @click.stop="removeEl(el.id)"
      >×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanvas } from '@/composables/useCanvas'

const { elements, selectedId, selectEl, removeEl } = useCanvas()

const reversedLayers = computed(() => [...elements.value].reverse())

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
