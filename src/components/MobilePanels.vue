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
            class="flex-1 bg-surface2 border border-line rounded-sm px-3 py-[9px] text-sm text-fore placeholder:text-faint outline-none transition-colors focus:border-accent focus:shadow-[0_0_0_2px_rgba(0,128,96,0.14)]"
            @keydown.enter="submitText"
          />
          <button
            class="flex-shrink-0 h-[40px] px-4 rounded-[7px] font-dm font-semibold text-[13px] text-white transition-all active:scale-[.95] hover:bg-[#2a2a2a]"
            style="background:#1a1a1a;"
            @click="submitText"
          >Add</button>
        </div>
        <ColorStrip v-model="mobColor" />
        <div class="overflow-x-auto scrollbar-none">
          <FontChips v-model="mobFont" />
        </div>
      </div>
    </div>

    <!-- ── IMAGE PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-image' ? 'max-height:240px; opacity:1' : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">Add Image</p>
        <div class="grid grid-cols-3 gap-[8px]">
          <button
            v-for="src in sources"
            :key="src.label"
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f1f1f1; border:1px dashed #c4c4c4;"
            @mouseenter="(e) => { const b = e.currentTarget as HTMLElement; b.style.borderColor='rgba(0,128,96,0.40)'; b.style.background='rgba(0,128,96,0.06)'; }"
            @mouseleave="(e) => { const b = e.currentTarget as HTMLElement; b.style.borderColor='#c4c4c4'; b.style.background='#f1f1f1'; }"
            @click="showToast(src.toast)"
          >
            <span class="text-[20px]">{{ src.icon }}</span>
            <span class="text-[11px] font-syne font-bold text-fore">{{ src.label }}</span>
          </button>
        </div>
        <div class="overflow-x-auto scrollbar-none">
          <EmojiGrid :items="PRESETS" :inline="true" @pick="addSticker" />
        </div>
      </div>
    </div>

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
            style="background:#f1f1f1; border:1px solid #d9d9d9;"
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
import { ref, watch } from "vue";
import ColorStrip from "@/components/ui/ColorStrip.vue";
import FontChips  from "@/components/ui/FontChips.vue";
import EmojiGrid  from "@/components/ui/EmojiGrid.vue";
import SliderRow  from "@/components/ui/SliderRow.vue";
import { STICKERS, ICONS, PRESETS } from "@/constants";
import { useCanvas } from "@/composables/useCanvas";
import { useToast }  from "@/composables/useToast";
import type { UploadSource } from "@/types";

defineProps<{ activePanel: string | null }>();

const { addText, addSticker, addIcon, selectedEl, updateEl, curColor, curFont } = useCanvas();
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

const sources: UploadSource[] = [
  { icon: "📷", label: "Camera",  toast: "📷 Camera"  },
  { icon: "🗂",  label: "Gallery", toast: "🗂 Gallery" },
  { icon: "🔗", label: "URL",     toast: "🔗 URL"     },
];
</script>
