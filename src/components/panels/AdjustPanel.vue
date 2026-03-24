<template>
  <div class="flex flex-col gap-3">

    <!-- Transform card -->
    <div class="rounded-[10px] p-3 flex flex-col gap-[10px]"
         style="background: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 1px 6px rgba(99,102,241,0.06);">
      <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Transform</p>
      <SliderRow label="Size"    :min="25"  :max="400" v-model="sizeVal" :displayValue="Math.round(sizeVal) + '%'" />
      <SliderRow label="Rotate"  :min="0"   :max="360" v-model="rotVal"  :displayValue="Math.round(rotVal) + '°'" />
      <SliderRow label="Opacity" :min="10"  :max="100" v-model="opVal"   :displayValue="Math.round(opVal) + '%'" />
    </div>

    <!-- Color override -->
    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Color override</p>
    <ColorStrip v-model="overrideColor" />

    <!-- No selection hint -->
    <p
      v-if="!selectedEl"
      class="text-[11px] text-center font-syne py-2"
      style="color: rgba(99,102,241,0.45);"
    >
      ✦ Select an element on the canvas
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SliderRow  from '@/components/ui/SliderRow.vue'
import ColorStrip from '@/components/ui/ColorStrip.vue'
import { useCanvas } from '@/composables/useCanvas'

const { selectedEl, updateEl } = useCanvas()

const sizeVal       = ref<number>(100)
const rotVal        = ref<number>(0)
const opVal         = ref<number>(100)
const overrideColor = ref<string>('#1a1a1a')

watch(selectedEl, el => {
  if (!el) return
  sizeVal.value       = Math.round((el.scale   ?? 1) * 100)
  rotVal.value        = Math.round( el.rotation ?? 0)
  opVal.value         = Math.round((el.opacity  ?? 1) * 100)
  overrideColor.value = el.color || '#1a1a1a'
}, { immediate: true })

watch(sizeVal,       v => { if (selectedEl.value) updateEl(selectedEl.value.id, { scale: v / 100 }) })
watch(rotVal,        v => { if (selectedEl.value) updateEl(selectedEl.value.id, { rotation: v }) })
watch(opVal,         v => { if (selectedEl.value) updateEl(selectedEl.value.id, { opacity: v / 100 }) })
watch(overrideColor, v => { if (selectedEl.value) updateEl(selectedEl.value.id, { color: v }) })
</script>
