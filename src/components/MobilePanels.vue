<template>
  <div class="md:hidden">
    <!-- Text panel -->
    <div
      class="flex-shrink-0 bg-surface border-t border-line overflow-hidden transition-all duration-[220ms]"
      :style="
        activePanel === 'mp-text'
          ? 'max-height:215px; opacity:1'
          : 'max-height:0; opacity:0'
      "
    >
      <div class="p-[12px_14px_14px] flex flex-col gap-2">
        <div class="flex gap-2">
          <input
            v-model="mobTextInput"
            type="text"
            placeholder="Type something…"
            maxlength="28"
            autocomplete="off"
            class="flex-1 bg-surface2 border border-line rounded-sm px-3 py-[9px] text-sm text-fore placeholder:text-faint outline-none transition-colors focus:border-accent"
            @keydown.enter="submitText"
          />
          <PButton variant="primary" @click="submitText">Add</PButton>
        </div>
        <ColorStrip v-model="mobColor" />
        <div class="flex gap-[5px] overflow-x-auto scrollbar-none">
          <FontChips v-model="mobFont" />
        </div>
      </div>
    </div>

    <!-- Image panel -->
    <div
      class="flex-shrink-0 bg-surface border-t border-line overflow-hidden transition-all duration-[220ms]"
      :style="
        activePanel === 'mp-image'
          ? 'max-height:215px; opacity:1'
          : 'max-height:0; opacity:0'
      "
    >
      <div class="p-[12px_14px_14px] flex flex-col gap-2">
        <div class="grid grid-cols-3 gap-[7px] mb-[9px]">
          <button
            v-for="src in sources"
            :key="src.label"
            class="bg-surface2 border border-dashed border-line rounded-[9px] py-[11px] px-[5px] flex flex-col items-center gap-1 cursor-pointer transition-all hover:border-accent hover:bg-accent-dim active:scale-[.94]"
            @click="showToast(src.toast)"
          >
            <span class="text-[19px]">{{ src.icon }}</span>
            <span class="text-[11px] font-syne font-bold">{{ src.label }}</span>
          </button>
        </div>
        <div class="flex gap-[5px] overflow-x-auto scrollbar-none">
          <EmojiGrid :items="PRESETS" :inline="true" @pick="addSticker" />
        </div>
      </div>
    </div>

    <!-- Sticker panel -->
    <div
      class="flex-shrink-0 bg-surface border-t border-line overflow-hidden transition-all duration-[220ms]"
      :style="
        activePanel === 'mp-sticker'
          ? 'max-height:215px; opacity:1'
          : 'max-height:0; opacity:0'
      "
    >
      <div class="p-[12px_14px_14px]">
        <div class="flex gap-[5px] overflow-x-auto scrollbar-none pb-[3px]">
          <EmojiGrid :items="STICKERS" :inline="true" @pick="addSticker" />
        </div>
      </div>
    </div>

    <!-- Icon panel -->
    <div
      class="flex-shrink-0 bg-surface border-t border-line overflow-hidden transition-all duration-[220ms]"
      :style="
        activePanel === 'mp-icon'
          ? 'max-height:215px; opacity:1'
          : 'max-height:0; opacity:0'
      "
    >
      <div class="p-[12px_14px_14px]">
        <div class="flex gap-[5px] overflow-x-auto scrollbar-none pb-[3px]">
          <EmojiGrid :items="ICONS" :inline="true" @pick="addIcon" />
        </div>
      </div>
    </div>

    <!-- Adjust panel -->
    <div
      class="flex-shrink-0 bg-surface border-t border-line overflow-hidden transition-all duration-[220ms]"
      :style="
        activePanel === 'mp-adjust'
          ? 'max-height:215px; opacity:1'
          : 'max-height:0; opacity:0'
      "
    >
      <div class="p-[12px_14px_14px] flex flex-col gap-2">
        <SliderRow
          label="Size"
          :min="25"
          :max="400"
          v-model="mobSize"
          :displayValue="mobSize + '%'"
        />
        <SliderRow
          label="Rotate"
          :min="0"
          :max="360"
          v-model="mobRot"
          :displayValue="mobRot + '°'"
        />
        <ColorStrip v-model="mobAdjColor" class="mt-[9px]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import ColorStrip from "@/components/ui/ColorStrip.vue";
import FontChips from "@/components/ui/FontChips.vue";
import EmojiGrid from "@/components/ui/EmojiGrid.vue";
import SliderRow from "@/components/ui/SliderRow.vue";
import { STICKERS, ICONS, PRESETS } from "@/constants";
import { useCanvas } from "@/composables/useCanvas";
import { useToast } from "@/composables/useToast";
import type { UploadSource } from "@/types";

defineProps<{ activePanel: string | null }>();

const {
  addText,
  addSticker,
  addIcon,
  selectedEl,
  updateEl,
  curColor,
  curFont,
} = useCanvas();
const { showToast } = useToast();

const mobTextInput = ref<string>("");
const mobColor = ref<string>(curColor.value);
const mobFont = ref<string>(curFont.value);
const mobSize = ref<number>(100);
const mobRot = ref<number>(0);
const mobAdjColor = ref<string>("#1a1a1a");

watch(mobColor, (v) => {
  curColor.value = v;
});
watch(mobFont, (v) => {
  curFont.value = v;
});
watch(
  selectedEl,
  (el) => {
    if (!el) return;
    mobSize.value = Math.round((el.scale ?? 1) * 100);
    mobRot.value = Math.round(el.rotation ?? 0);
  },
  { immediate: true },
);
watch(mobSize, (v) => {
  if (selectedEl.value) updateEl(selectedEl.value.id, { scale: v / 100 });
});
watch(mobRot, (v) => {
  if (selectedEl.value) updateEl(selectedEl.value.id, { rotation: v });
});
watch(mobAdjColor, (v) => {
  if (selectedEl.value) updateEl(selectedEl.value.id, { color: v });
});

function submitText(): void {
  addText(mobTextInput.value);
  mobTextInput.value = "";
}

const sources: UploadSource[] = [
  { icon: "📷", label: "Camera", toast: "📷 Camera" },
  { icon: "🗂", label: "Gallery", toast: "🗂 Gallery" },
  { icon: "🔗", label: "URL", toast: "🔗 URL" },
];
</script>
