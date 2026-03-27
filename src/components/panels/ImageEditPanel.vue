<template>
  <div class="flex flex-col gap-3">
    <p
      v-if="!selectedEl || selectedEl.type !== 'image'"
      class="text-[11px] text-center font-syne py-2"
      style="color: rgba(99,102,241,0.45);"
    >✦ Select an image element on the canvas</p>

    <template v-else>
      <!-- Transform -->
      <div
        class="rounded-[10px] p-3 flex flex-col gap-[10px]"
        style="background: #f8fafc; border: 1px solid #e2e8f0; box-shadow: 0 1px 6px rgba(99,102,241,0.06);"
      >
        <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Transform</p>
        <SliderRow label="Size"    :min="25"  :max="400" v-model="sizeVal" :displayValue="Math.round(sizeVal) + '%'" />
        <SliderRow label="Rotate"  :min="0"   :max="360" v-model="rotVal"  :displayValue="Math.round(rotVal) + '°'" />
        <SliderRow label="Opacity" :min="10"  :max="100" v-model="opVal"   :displayValue="Math.round(opVal) + '%'" />
      </div>

      <!-- Flip -->
      <div class="flex flex-col gap-[6px]">
        <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Flip</p>
        <div class="flex gap-2">
          <button
            class="flex-1 py-[7px] rounded-[8px] text-[11px] font-bold font-syne transition-all active:scale-95"
            :style="selectedEl.flipX
              ? 'background:#008060; color:#fff; border:1px solid #008060;'
              : 'background:#f8fafc; color:#475569; border:1px solid #e2e8f0;'"
            @click="toggleFlip('flipX')"
          >↔ Horizontal</button>
          <button
            class="flex-1 py-[7px] rounded-[8px] text-[11px] font-bold font-syne transition-all active:scale-95"
            :style="selectedEl.flipY
              ? 'background:#008060; color:#fff; border:1px solid #008060;'
              : 'background:#f8fafc; color:#475569; border:1px solid #e2e8f0;'"
            @click="toggleFlip('flipY')"
          >↕ Vertical</button>
        </div>
      </div>

      <!-- Filter presets -->
      <div class="flex flex-col gap-[6px]">
        <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Filter Presets</p>
        <div class="grid grid-cols-4 gap-[5px]">
          <button
            v-for="p in FILTER_PRESETS"
            :key="p.name"
            class="py-[6px] rounded-[7px] text-[10px] font-syne font-bold transition-all active:scale-95"
            :style="isActivePreset(p)
              ? 'background:#008060; color:#fff; border:1px solid transparent;'
              : 'background:#f8fafc; color:#475569; border:1px solid #e2e8f0;'"
            @click="applyPreset(p)"
          >{{ p.name }}</button>
        </div>
      </div>

      <!-- Adjustment sliders -->
      <div
        class="rounded-[10px] p-3 flex flex-col gap-[10px]"
        style="background: #f8fafc; border: 1px solid #e2e8f0;"
      >
        <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Adjustments</p>
        <SliderRow label="Bright"    :min="0" :max="200" v-model="brightnessVal" :displayValue="brightnessVal + '%'" />
        <SliderRow label="Contrast"  :min="0" :max="200" v-model="contrastVal"   :displayValue="contrastVal + '%'" />
        <SliderRow label="Sat."      :min="0" :max="200" v-model="saturateVal"   :displayValue="saturateVal + '%'" />
      </div>

      <!-- Crop -->
      <button
        class="w-full py-[9px] rounded-[9px] text-[12px] font-bold font-syne text-white transition-all active:scale-95"
        style="background: linear-gradient(135deg, #475569, #334155);"
        @click="triggerCrop"
      >✂ Crop Image</button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import SliderRow from '@/components/ui/SliderRow.vue'
import { useCanvas } from '@/composables/useCanvas'
import { useCrop } from '@/composables/useCrop'

const { selectedEl, updateEl, saveUndo } = useCanvas()
const { openCrop } = useCrop()

// ── Transform ──
const sizeVal = ref(100)
const rotVal  = ref(0)
const opVal   = ref(100)

// ── Filters ──
const brightnessVal = ref(100)
const contrastVal   = ref(100)
const saturateVal   = ref(100)

const FILTER_PRESETS = [
  { name: 'Normal',   brightness: 100, contrast: 100, saturate: 100, sepia: 0  },
  { name: 'Vivid',    brightness: 100, contrast: 115, saturate: 160, sepia: 0  },
  { name: 'Warm',     brightness: 105, contrast: 100, saturate: 130, sepia: 30 },
  { name: 'Fade',     brightness: 115, contrast: 80,  saturate: 70,  sepia: 0  },
  { name: 'B&W',      brightness: 100, contrast: 110, saturate: 0,   sepia: 0  },
  { name: 'Sepia',    brightness: 105, contrast: 100, saturate: 80,  sepia: 80 },
  { name: 'Dramatic', brightness: 90,  contrast: 150, saturate: 60,  sepia: 10 },
  { name: 'Cool',     brightness: 100, contrast: 105, saturate: 80,  sepia: 0  },
]

// Sync local state when selection changes
watch(selectedEl, el => {
  if (!el || el.type !== 'image') return
  sizeVal.value       = Math.round((el.scale   ?? 1) * 100)
  rotVal.value        = Math.round( el.rotation ?? 0)
  opVal.value         = Math.round((el.opacity  ?? 1) * 100)
  brightnessVal.value = el.brightness ?? 100
  contrastVal.value   = el.contrast   ?? 100
  saturateVal.value   = el.saturate   ?? 100
}, { immediate: true })

// Write-back sliders → canvas
watch(sizeVal,       v => { if (selectedEl.value?.type === 'image') updateEl(selectedEl.value.id, { scale: v / 100 }) })
watch(rotVal,        v => { if (selectedEl.value?.type === 'image') updateEl(selectedEl.value.id, { rotation: v }) })
watch(opVal,         v => { if (selectedEl.value?.type === 'image') updateEl(selectedEl.value.id, { opacity: v / 100 }) })
watch(brightnessVal, v => { if (selectedEl.value?.type === 'image') updateEl(selectedEl.value.id, { brightness: v }) })
watch(contrastVal,   v => { if (selectedEl.value?.type === 'image') updateEl(selectedEl.value.id, { contrast:   v }) })
watch(saturateVal,   v => { if (selectedEl.value?.type === 'image') updateEl(selectedEl.value.id, { saturate:   v }) })

function toggleFlip(field: 'flipX' | 'flipY'): void {
  if (!selectedEl.value) return
  saveUndo()
  updateEl(selectedEl.value.id, { [field]: !selectedEl.value[field] })
}

function isActivePreset(p: typeof FILTER_PRESETS[0]): boolean {
  const el = selectedEl.value
  if (!el) return false
  return (
    (el.brightness ?? 100) === p.brightness &&
    (el.contrast   ?? 100) === p.contrast   &&
    (el.saturate   ?? 100) === p.saturate   &&
    (el.sepia      ?? 0)   === p.sepia
  )
}

function applyPreset(p: typeof FILTER_PRESETS[0]): void {
  if (!selectedEl.value) return
  saveUndo()
  brightnessVal.value = p.brightness
  contrastVal.value   = p.contrast
  saturateVal.value   = p.saturate
  updateEl(selectedEl.value.id, {
    brightness: p.brightness,
    contrast:   p.contrast,
    saturate:   p.saturate,
    sepia:      p.sepia,
  })
}

function triggerCrop(): void {
  if (!selectedEl.value?.content) return
  const id = selectedEl.value.id
  openCrop(selectedEl.value.content, (dataUrl) => {
    saveUndo()
    updateEl(id, { content: dataUrl })
  })
}
</script>
