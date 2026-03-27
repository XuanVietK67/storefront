<template>
  <div class="flex flex-col gap-3">
    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">{{ t('panel.uploadSource') }}</p>
    <div class="grid grid-cols-3 gap-2">
      <!-- Camera -->
      <button
        class="group flex flex-col items-center gap-[5px] py-3 px-1 rounded-[10px] cursor-pointer text-center transition-all duration-200 active:scale-[.94]"
        style="background: #f1f1f1; border: 1px dashed #c4c4c4;"
        @mouseenter="(e) => cardHover(e, true)"
        @mouseleave="(e) => cardHover(e, false)"
        @click="openCamera"
      >
        <span class="text-[22px] transition-transform duration-200 group-hover:scale-110">📷</span>
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">{{ t('panel.camera') }}</span>
        <span class="text-[9px] text-faint">{{ t('panel.takePhoto') }}</span>
      </button>

      <!-- Gallery / File -->
      <label
        class="group flex flex-col items-center gap-[5px] py-3 px-1 rounded-[10px] cursor-pointer text-center transition-all duration-200 active:scale-[.94]"
        style="background: #f1f1f1; border: 1px dashed #c4c4c4;"
        @mouseenter="(e) => cardHover(e, true)"
        @mouseleave="(e) => cardHover(e, false)"
      >
        <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
        <span class="text-[22px] transition-transform duration-200 group-hover:scale-110">🗂</span>
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">{{ t('panel.gallery') }}</span>
        <span class="text-[9px] text-faint">{{ t('panel.fromFiles') }}</span>
      </label>

      <!-- URL -->
      <button
        class="group flex flex-col items-center gap-[5px] py-3 px-1 rounded-[10px] cursor-pointer text-center transition-all duration-200 active:scale-[.94]"
        style="background: #f1f1f1; border: 1px dashed #c4c4c4;"
        @mouseenter="(e) => cardHover(e, true)"
        @mouseleave="(e) => cardHover(e, false)"
        @click="urlMode = !urlMode"
      >
        <span class="text-[22px] transition-transform duration-200 group-hover:scale-110">🔗</span>
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">{{ t('panel.url') }}</span>
        <span class="text-[9px] text-faint">{{ t('panel.pasteLink') }}</span>
      </button>
    </div>

    <!-- URL input row -->
    <div v-if="urlMode" class="flex gap-2">
      <input
        v-model="urlInput"
        type="url"
        :placeholder="t('panel.urlPlaceholder')"
        class="flex-1 text-[11px] px-2 py-[6px] rounded-[8px] outline-none"
        style="border: 1px solid #d0d0d0; background: #fafafa;"
        @keydown.enter="addFromUrl"
      />
      <button
        class="px-3 py-[6px] rounded-[8px] text-[11px] font-bold text-white transition-opacity active:opacity-75"
        style="background: #008060;"
        @click="addFromUrl"
      >{{ t('panel.add') }}</button>
    </div>

    <div class="h-px" style="background: linear-gradient(90deg, transparent, #d9d9d9, transparent);" />

    <ImageEditPanel />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ImageEditPanel from '@/components/panels/ImageEditPanel.vue'
import { useCanvas } from '@/composables/useCanvas'
import { useCamera } from '@/composables/useCamera'
import { useToast } from '@/composables/useToast'

const { t } = useI18n()
const { addImage } = useCanvas()
const { showToast } = useToast()
const { openCamera } = useCamera()

const urlMode = ref(false)
const urlInput = ref('')

function cardHover(e: MouseEvent, on: boolean): void {
  const el = e.currentTarget as HTMLElement
  el.style.borderColor = on ? 'rgba(0,128,96,0.35)' : '#c4c4c4'
  el.style.background  = on ? 'rgba(0,128,96,0.06)' : '#f1f1f1'
  el.style.boxShadow   = on ? '0 2px 10px rgba(0,128,96,0.10)' : 'none'
}

function onFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { showToast(t('toast.selectImageFile')); return }
  const reader = new FileReader()
  reader.onload = (ev) => { const src = ev.target?.result as string; if (src) addImage(src) }
  reader.readAsDataURL(file)
  ;(e.target as HTMLInputElement).value = ''
}

function addFromUrl(): void {
  const url = urlInput.value.trim()
  if (!url) { showToast(t('toast.enterImageUrl')); return }
  if (!/^https?:\/\/.+/i.test(url)) { showToast(t('toast.urlMustStartHttp')); return }
  addImage(url)
  urlInput.value = ''
  urlMode.value = false
}
</script>
