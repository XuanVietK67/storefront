<template>
  <div class="flex flex-col gap-3">
    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Upload Source</p>
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
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">Camera</span>
        <span class="text-[9px] text-faint">Take photo</span>
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
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">Gallery</span>
        <span class="text-[9px] text-faint">From files</span>
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
        <span class="text-[11px] font-bold font-syne text-muted group-hover:text-accent transition-colors duration-150">URL</span>
        <span class="text-[9px] text-faint">Paste link</span>
      </button>
    </div>

    <!-- URL input row -->
    <div v-if="urlMode" class="flex gap-2">
      <input
        v-model="urlInput"
        type="url"
        placeholder="https://example.com/image.jpg"
        class="flex-1 text-[11px] px-2 py-[6px] rounded-[8px] outline-none"
        style="border: 1px solid #d0d0d0; background: #fafafa;"
        @keydown.enter="addFromUrl"
      />
      <button
        class="px-3 py-[6px] rounded-[8px] text-[11px] font-bold text-white transition-opacity active:opacity-75"
        style="background: #008060;"
        @click="addFromUrl"
      >Add</button>
    </div>

    <div class="h-px" style="background: linear-gradient(90deg, transparent, #d9d9d9, transparent);" />

    <p class="font-syne text-[9px] font-bold tracking-[.12em] uppercase text-faint">Quick Add</p>
    <EmojiGrid :items="PRESETS" :inline="false" @pick="addSticker" />
  </div>

  <!-- Camera modal -->
  <Teleport to="body">
    <div
      v-if="cameraOpen"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style="background: rgba(0,0,0,0.82);"
      @click.self="closeCamera"
    >
      <div class="relative flex flex-col items-center gap-4 p-4 rounded-2xl" style="background: #1a1a1a; max-width: 360px; width: 100%;">
        <!-- Header -->
        <div class="flex items-center justify-between w-full">
          <span class="text-white text-[13px] font-bold font-syne">Take a Photo</span>
          <button class="text-white text-[20px] leading-none opacity-60 hover:opacity-100" @click="closeCamera">×</button>
        </div>

        <!-- Video preview -->
        <div class="relative w-full rounded-xl overflow-hidden" style="background: #000; aspect-ratio: 4/3;">
          <video
            ref="videoEl"
            class="w-full h-full object-cover"
            autoplay
            playsinline
            muted
          />
          <div v-if="cameraError" class="absolute inset-0 flex items-center justify-center text-center px-4">
            <span class="text-[12px]" style="color: #ff6b6b;">{{ cameraError }}</span>
          </div>
        </div>

        <!-- Shutter button -->
        <button
          class="w-[60px] h-[60px] rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90"
          style="background: #fff;"
          :disabled="!!cameraError"
          @click="capturePhoto"
        >
          <div class="w-[46px] h-[46px] rounded-full" style="background: #008060;" />
        </button>

        <!-- Hidden canvas for capture -->
        <canvas ref="captureCanvas" class="hidden" />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import EmojiGrid from '@/components/ui/EmojiGrid.vue'
import { PRESETS } from '@/constants'
import { useCanvas } from '@/composables/useCanvas'
import { useToast } from '@/composables/useToast'

const { addSticker, addImage } = useCanvas()
const { showToast } = useToast()

const urlMode = ref(false)
const urlInput = ref('')

// Camera refs
const cameraOpen = ref(false)
const cameraError = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
const captureCanvas = ref<HTMLCanvasElement | null>(null)
let stream: MediaStream | null = null

function cardHover(e: MouseEvent, on: boolean): void {
  const el = e.currentTarget as HTMLElement
  el.style.borderColor = on ? 'rgba(0,128,96,0.35)' : '#c4c4c4'
  el.style.background  = on ? 'rgba(0,128,96,0.06)' : '#f1f1f1'
  el.style.boxShadow   = on ? '0 2px 10px rgba(0,128,96,0.10)' : 'none'
}

async function openCamera(): Promise<void> {
  cameraError.value = ''
  cameraOpen.value = true
  await nextTick()
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    if (videoEl.value) videoEl.value.srcObject = stream
  } catch {
    cameraError.value = 'Camera access denied or not available on this device.'
  }
}

function closeCamera(): void {
  stream?.getTracks().forEach(t => t.stop())
  stream = null
  cameraOpen.value = false
  cameraError.value = ''
}

function capturePhoto(): void {
  const video = videoEl.value
  const canvas = captureCanvas.value
  if (!video || !canvas) return

  canvas.width  = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.drawImage(video, 0, 0)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
  addImage(dataUrl)
  closeCamera()
}

function onFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { showToast('⚠️ Please select an image file'); return }
  const reader = new FileReader()
  reader.onload = (ev) => {
    const src = ev.target?.result as string
    if (src) addImage(src)
  }
  reader.readAsDataURL(file)
  ;(e.target as HTMLInputElement).value = ''
}

function addFromUrl(): void {
  const url = urlInput.value.trim()
  if (!url) { showToast('⚠️ Enter an image URL'); return }
  if (!/^https?:\/\/.+/i.test(url)) { showToast('⚠️ URL must start with http(s)://'); return }
  addImage(url)
  urlInput.value = ''
  urlMode.value = false
}
</script>
