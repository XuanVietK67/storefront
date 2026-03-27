<template>
  <Teleport to="body">
    <div
      v-if="cameraOpen"
      class="fixed inset-0 z-50 flex flex-col md:items-center md:justify-center"
      style="background: #000;"
      @click.self="closeCamera"
    >
      <!-- Mobile: flex-1 fills full screen. Desktop: fixed-width card -->
      <div
        class="flex-1 flex flex-col w-full md:flex-none md:w-[360px] md:rounded-2xl md:overflow-hidden"
        style="background: #1a1a1a;"
      >
        <!-- Header -->
        <div
          class="flex-shrink-0 flex items-center justify-between px-5 py-4 md:px-4 md:py-3"
          style="background: rgba(0,0,0,0.5);"
        >
          <span class="text-white text-[14px] font-bold font-syne tracking-wide">Take a Photo</span>
          <button
            class="text-white text-[26px] leading-none opacity-60 active:opacity-100"
            @click="closeCamera"
          >×</button>
        </div>

        <!-- Video: fills remaining height on mobile; fixed aspect-ratio on desktop -->
        <div class="flex-1 md:flex-none md:aspect-[4/3] relative overflow-hidden" style="background: #000;">
          <video
            ref="videoEl"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-200"
            :style="flipped ? 'transform: scaleX(-1)' : ''"
            autoplay
            playsinline
            muted
          />
          <div
            v-if="cameraError"
            class="absolute inset-0 flex items-center justify-center px-8 text-center"
            style="background: rgba(0,0,0,0.80);"
          >
            <span class="text-[13px] leading-relaxed" style="color: #ff6b6b;">{{ cameraError }}</span>
          </div>
        </div>

        <!-- Controls bar -->
        <div
          class="flex-shrink-0 flex items-center justify-between px-10 py-7 md:px-4 md:py-4"
          style="background: rgba(0,0,0,0.55); padding-bottom: max(28px, env(safe-area-inset-bottom, 28px));"
        >
          <!-- Flip -->
          <button
            class="w-[48px] h-[48px] md:w-[44px] md:h-[44px] rounded-full flex items-center justify-center transition-all active:scale-90"
            :style="flipped
              ? 'background: rgba(0,128,96,0.30); border: 1.5px solid #008060;'
              : 'background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.28);'"
            title="Flip horizontal"
            @click="flipped = !flipped"
          >
            <span class="text-[22px] select-none">🔄</span>
          </button>

          <!-- Shutter -->
          <button
            class="w-[72px] h-[72px] md:w-[60px] md:h-[60px] rounded-full border-[4px] border-white flex items-center justify-center transition-transform active:scale-90 disabled:opacity-40"
            style="background: #fff;"
            :disabled="!!cameraError"
            @click="capturePhoto"
          >
            <div class="w-[56px] h-[56px] md:w-[46px] md:h-[46px] rounded-full" style="background: #008060;" />
          </button>

          <!-- Cancel -->
          <button
            class="w-[48px] md:w-[44px] flex flex-col items-center gap-[3px] opacity-70 active:opacity-100 transition-opacity"
            @click="closeCamera"
          >
            <span class="text-[22px] leading-none">✕</span>
            <span class="text-white text-[10px] font-syne font-bold tracking-wide">Cancel</span>
          </button>
        </div>
      </div>

      <!-- Hidden canvas for capture -->
      <canvas ref="captureCanvas" class="hidden" />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useCamera } from '@/composables/useCamera'
import { useCanvas } from '@/composables/useCanvas'

const { cameraOpen } = useCamera()
const { addImage } = useCanvas()

const flipped = ref(false)
const cameraError = ref('')
const videoEl = ref<HTMLVideoElement | null>(null)
const captureCanvas = ref<HTMLCanvasElement | null>(null)
let stream: MediaStream | null = null

watch(cameraOpen, async (open) => {
  if (!open) return
  cameraError.value = ''
  flipped.value = false
  await nextTick()
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
    if (videoEl.value) videoEl.value.srcObject = stream
  } catch {
    cameraError.value = 'Camera access denied or not available on this device.'
  }
})

function closeCamera(): void {
  stream?.getTracks().forEach(t => t.stop())
  stream = null
  cameraOpen.value = false
  cameraError.value = ''
  flipped.value = false
}

function capturePhoto(): void {
  const video = videoEl.value
  const canvas = captureCanvas.value
  if (!video || !canvas) return
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if (flipped.value) {
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(video, 0, 0)
  addImage(canvas.toDataURL('image/jpeg', 0.9))
  closeCamera()
}
</script>
