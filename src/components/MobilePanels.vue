<template>
  <div class="md:hidden">

    <!-- ── TEXT PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-text' ? 'max-height:240px; opacity:1' : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">Add Text</p>
        <div class="flex gap-2">
          <input
            v-model="mobTextInput"
            type="text"
            placeholder="Type something…"
            maxlength="28"
            autocomplete="off"
            class="flex-1 rounded-[8px] px-3 py-[9px] text-sm outline-none transition-all"
            style="background:#f8fafc; border:1.5px solid #e2e8f0; color:#0f172a; caret-color:#6366f1;"
            @focus="(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'"
            @blur="(e) => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'"
            @keydown.enter="submitText"
          />
          <button
            class="flex-shrink-0 h-[40px] px-4 rounded-[7px] font-dm font-semibold text-[13px] text-white transition-all active:scale-[.95] hover:brightness-110"
            style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 3px 10px rgba(99,102,241,0.28);"
            @click="submitText"
          >Add</button>
        </div>
        <ColorStrip v-model="mobColor" />
        <FontPicker v-model="mobFont" />
      </div>
    </div>

    <!-- ── IMAGE PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-image' ? (urlMode ? 'max-height:300px; opacity:1' : 'max-height:240px; opacity:1') : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">Add Image</p>
        <div class="grid grid-cols-3 gap-[8px]">
          <!-- Camera -->
          <button
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f8fafc; border:1px dashed #cbd5e1;"
            @click="openCamera"
          >
            <span class="text-[20px]">📷</span>
            <span class="text-[11px] font-syne font-bold text-fore">Camera</span>
          </button>

          <!-- Gallery -->
          <label
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f8fafc; border:1px dashed #cbd5e1;"
          >
            <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
            <span class="text-[20px]">🗂</span>
            <span class="text-[11px] font-syne font-bold text-fore">Gallery</span>
          </label>

          <!-- URL -->
          <button
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f8fafc; border:1px dashed #cbd5e1;"
            @click="urlMode = !urlMode"
          >
            <span class="text-[20px]">🔗</span>
            <span class="text-[11px] font-syne font-bold text-fore">URL</span>
          </button>
        </div>

        <!-- URL input row -->
        <div v-if="urlMode" class="flex gap-2">
          <input
            v-model="urlInput"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="flex-1 text-[11px] px-2 py-[7px] rounded-[8px] outline-none"
            style="border:1px solid #e2e8f0; background:#f8fafc;"
            @keydown.enter="addFromUrl"
          />
          <button
            class="px-3 py-[7px] rounded-[8px] text-[11px] font-bold text-white active:opacity-75"
            style="background:#008060;"
            @click="addFromUrl"
          >Add</button>
        </div>

        <div class="overflow-x-auto scrollbar-none">
          <EmojiGrid :items="PRESETS" :inline="true" @pick="addSticker" />
        </div>
      </div>
    </div>

  <!-- Camera modal (mobile full-screen) -->
  <Teleport to="body">
    <div
      v-if="cameraOpen"
      class="fixed inset-0 z-50 flex flex-col"
      style="background:#000;"
    >
      <!-- Header bar -->
      <div class="flex items-center justify-between px-4 py-3" style="background:rgba(0,0,0,0.6);">
        <span class="text-white text-[14px] font-bold font-syne">Take a Photo</span>
        <button class="text-white text-[24px] leading-none opacity-70 active:opacity-100" @click="closeCamera">×</button>
      </div>

      <!-- Video preview fills remaining space -->
      <div class="flex-1 relative overflow-hidden">
        <video
          ref="videoEl"
          class="w-full h-full object-cover"
          autoplay
          playsinline
          muted
        />
        <div v-if="cameraError" class="absolute inset-0 flex items-center justify-center px-6 text-center" style="background:rgba(0,0,0,0.75);">
          <span class="text-[13px]" style="color:#ff6b6b;">{{ cameraError }}</span>
        </div>
      </div>

      <!-- Shutter bar -->
      <div class="flex items-center justify-center py-6" style="background:rgba(0,0,0,0.6);">
        <button
          class="w-[68px] h-[68px] rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90"
          :disabled="!!cameraError"
          @click="capturePhoto"
        >
          <div class="w-[52px] h-[52px] rounded-full" style="background:#008060;" />
        </button>
      </div>

      <!-- Hidden canvas for capture -->
      <canvas ref="captureCanvas" class="hidden" />
    </div>
  </Teleport>

    <!-- ── STICKER PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-sticker' ? 'max-height:240px; opacity:1' : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">Stickers</p>
        <div class="overflow-x-auto scrollbar-none pb-[2px]">
          <EmojiGrid :items="STICKERS" :inline="true" @pick="addSticker" />
        </div>
      </div>
    </div>

    <!-- ── ICON PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-icon' ? 'max-height:240px; opacity:1' : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">Icons</p>
        <div class="overflow-x-auto scrollbar-none pb-[2px]">
          <EmojiGrid :items="ICONS" :inline="true" @pick="addIcon" />
        </div>
      </div>
    </div>

    <!-- ── ADJUST PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-adjust' ? 'max-height:240px; opacity:1' : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">Adjust Selected</p>

        <!-- No-selection hint -->
        <p
          v-if="!selectedEl"
          class="text-[11px] font-syne text-center py-[8px]"
          style="color:rgba(0,128,96,0.55);"
        >✦ Select an element on the canvas</p>

        <template v-else>
          <div
            class="rounded-[9px] p-[10px] flex flex-col gap-[10px]"
            style="background:#f8fafc; border:1px solid #e2e8f0;"
          >
            <SliderRow label="Size"   :min="25"  :max="400" v-model="mobSize" :displayValue="mobSize + '%'" />
            <SliderRow label="Rotate" :min="0"   :max="360" v-model="mobRot"  :displayValue="mobRot + '°'" />
          </div>
          <ColorStrip v-model="mobAdjColor" />
        </template>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useCamera } from "@/composables/useCamera";
import ColorStrip from "@/components/ui/ColorStrip.vue";
import FontPicker from "@/components/ui/FontPicker.vue";
import EmojiGrid  from "@/components/ui/EmojiGrid.vue";
import SliderRow  from "@/components/ui/SliderRow.vue";
import { STICKERS, ICONS, PRESETS } from "@/constants";
import { useCanvas } from "@/composables/useCanvas";
import { useToast }  from "@/composables/useToast";

defineProps<{ activePanel: string | null }>();

const { addText, addSticker, addIcon, addImage, selectedEl, updateEl, curColor, curFont } = useCanvas();
const { showToast } = useToast();

const mobTextInput = ref<string>("");
const mobColor     = ref<string>(curColor.value);
const mobFont      = ref<string>(curFont.value);
const mobSize      = ref<number>(100);
const mobRot       = ref<number>(0);
const mobAdjColor  = ref<string>("#1a1a1a");

watch(mobColor, (v) => { curColor.value = v; });
watch(mobFont,  (v) => { curFont.value  = v; });
watch(selectedEl, (el) => {
  if (!el) return;
  mobSize.value = Math.round((el.scale    ?? 1) * 100);
  mobRot.value  = Math.round( el.rotation ?? 0);
}, { immediate: true });
watch(mobSize,     (v) => { if (selectedEl.value) updateEl(selectedEl.value.id, { scale: v / 100 }); });
watch(mobRot,      (v) => { if (selectedEl.value) updateEl(selectedEl.value.id, { rotation: v }); });
watch(mobAdjColor, (v) => { if (selectedEl.value) updateEl(selectedEl.value.id, { color: v }); });

function submitText(): void {
  addText(mobTextInput.value);
  mobTextInput.value = "";
}

// ── Image: URL ──
const urlMode  = ref(false);
const urlInput = ref('');

function addFromUrl(): void {
  const url = urlInput.value.trim();
  if (!url) { showToast('⚠️ Enter an image URL'); return; }
  if (!/^https?:\/\/.+/i.test(url)) { showToast('⚠️ URL must start with http(s)://'); return; }
  addImage(url);
  urlInput.value = '';
  urlMode.value  = false;
}

function onFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast('⚠️ Please select an image file'); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const src = ev.target?.result as string;
    if (src) addImage(src);
  };
  reader.readAsDataURL(file);
  (e.target as HTMLInputElement).value = '';
}

// ── Image: Camera ──
const { cameraOpen } = useCamera();
const cameraError   = ref('');
const videoEl       = ref<HTMLVideoElement | null>(null);
const captureCanvas = ref<HTMLCanvasElement | null>(null);
let stream: MediaStream | null = null;

async function openCamera(): Promise<void> {
  cameraError.value = '';
  cameraOpen.value  = true;
  await nextTick();
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    if (videoEl.value) videoEl.value.srcObject = stream;
  } catch {
    cameraError.value = 'Camera access denied or not available on this device.';
  }
}

function closeCamera(): void {
  stream?.getTracks().forEach(t => t.stop());
  stream = null;
  cameraOpen.value  = false;
  cameraError.value = '';
}

function capturePhoto(): void {
  const video  = videoEl.value;
  const canvas = captureCanvas.value;
  if (!video || !canvas) return;
  canvas.width  = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.drawImage(video, 0, 0);
  addImage(canvas.toDataURL('image/jpeg', 0.9));
  closeCamera();
}
</script>
