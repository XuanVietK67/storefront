<template>
  <div class="md:hidden">

    <!-- ── TEXT PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-text' ? 'max-height:480px; opacity:1' : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">{{ t('panel.addText') }}</p>
        <div class="flex gap-2">
          <input
            v-model="mobTextInput"
            type="text"
            :placeholder="t('panel.typeSomething')"
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
          >{{ t('panel.add') }}</button>
        </div>

        <ColorStrip v-model="mobColor" />
        <FontPicker v-model="mobFont" />

        <!-- Style toggles -->
        <div class="flex gap-[6px]">
          <button
            v-for="btn in mobStyleButtons"
            :key="btn.key"
            class="flex-1 h-[32px] rounded-[7px] text-[12px] font-semibold transition-all active:scale-95 flex items-center justify-center"
            :style="btn.active
              ? 'background:#6366f1;color:#fff;box-shadow:0 2px 6px rgba(99,102,241,0.28);'
              : 'background:#f1f5f9;color:#64748b;border:1.5px solid #e2e8f0;'"
            @click="btn.toggle()"
          >
            <span :style="btn.labelStyle">{{ btn.label }}</span>
          </button>
        </div>

        <!-- Font size + letter spacing -->
        <div class="flex items-center gap-[5px]">
          <span class="text-[9px] font-syne font-bold uppercase tracking-wide flex-shrink-0" style="color:#94a3b8;">Aa</span>
          <button class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[11px] active:scale-90 flex items-center justify-center" style="background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;" @click="adjustMobFontSize(-2)">A−</button>
          <span class="font-syne font-bold text-[11px] text-center flex-shrink-0" style="min-width:32px;color:#334155;">{{ mobFontSize }}px</span>
          <button class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[11px] active:scale-90 flex items-center justify-center" style="background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;" @click="adjustMobFontSize(+2)">A+</button>
          <div class="w-px h-[18px] flex-shrink-0 mx-[2px]" style="background:#e2e8f0;" />
          <span class="text-[9px] font-syne font-bold uppercase tracking-wide flex-shrink-0" style="color:#94a3b8;">{{ t('textEdit.spacingLabel') }}</span>
          <button class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[14px] active:scale-90 flex items-center justify-center" style="background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;" @click="adjustMobLetterSpacing(-1)">−</button>
          <span class="font-syne font-bold text-[11px] text-center flex-shrink-0" style="min-width:20px;color:#334155;">{{ mobLetterSpacing }}</span>
          <button class="flex-shrink-0 w-[28px] h-[28px] rounded-[6px] font-dm font-bold text-[14px] active:scale-90 flex items-center justify-center" style="background:#f8fafc;border:1px solid #e2e8f0;color:#64748b;" @click="adjustMobLetterSpacing(+1)">+</button>
        </div>

        <!-- Text effects -->
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">{{ t('panel.textEffects') }}</p>
        <div class="grid grid-cols-5 gap-[5px]">
          <button
            v-for="eff in mobEffectButtons"
            :key="eff.key"
            class="h-[38px] rounded-[8px] flex flex-col items-center justify-center gap-[1px] transition-all active:scale-95"
            :style="mobTextEffect === eff.key
              ? 'background:#6366f1;color:#fff;box-shadow:0 2px 8px rgba(99,102,241,0.30);'
              : 'background:#f1f5f9;color:#64748b;border:1.5px solid #e2e8f0;'"
            @click="toggleMobEffect(eff.key)"
          >
            <span class="text-[13px] leading-none">{{ eff.icon }}</span>
            <span class="text-[8px] font-syne font-bold tracking-wide leading-none">{{ eff.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── IMAGE PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-image' ? (urlMode ? 'max-height:300px; opacity:1' : 'max-height:240px; opacity:1') : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">{{ t('panel.addImage') }}</p>
        <div class="grid grid-cols-3 gap-[8px]">
          <!-- Camera -->
          <button
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f8fafc; border:1px dashed #cbd5e1;"
            @click="openCamera"
          >
            <span class="text-[20px]">📷</span>
            <span class="text-[11px] font-syne font-bold text-fore">{{ t('panel.camera') }}</span>
          </button>

          <!-- Gallery -->
          <label
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f8fafc; border:1px dashed #cbd5e1;"
          >
            <input type="file" accept="image/*" class="hidden" @change="onFileChange" />
            <span class="text-[20px]">🗂</span>
            <span class="text-[11px] font-syne font-bold text-fore">{{ t('panel.gallery') }}</span>
          </label>

          <!-- URL -->
          <button
            class="flex flex-col items-center gap-[5px] py-[12px] px-2 rounded-[10px] cursor-pointer transition-all active:scale-[.94]"
            style="background:#f8fafc; border:1px dashed #cbd5e1;"
            @click="urlMode = !urlMode"
          >
            <span class="text-[20px]">🔗</span>
            <span class="text-[11px] font-syne font-bold text-fore">{{ t('panel.url') }}</span>
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
          >{{ t('panel.add') }}</button>
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
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">{{ t('panel.stickers') }}</p>
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
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">{{ t('panel.icons') }}</p>
        <div class="overflow-x-auto scrollbar-none pb-[2px]">
          <EmojiGrid :items="ICONS" :inline="true" @pick="addIcon" />
        </div>
      </div>
    </div>

    <!-- ── ADJUST PANEL ── -->
    <div
      class="flex-shrink-0 overflow-hidden transition-all duration-[220ms]"
      style="background:#ffffff; border-top:2px solid #008060;"
      :style="activePanel === 'mp-adjust'
        ? (selectedEl?.type === 'image' ? 'max-height:380px; opacity:1' : 'max-height:240px; opacity:1')
        : 'max-height:0; opacity:0'"
    >
      <div class="px-4 pt-[10px] pb-[14px] flex flex-col gap-[10px]">
        <p class="text-[9px] font-syne font-bold tracking-[.12em] uppercase text-accent">{{ t('panel.adjustSelected') }}</p>

        <!-- No-selection hint -->
        <p
          v-if="!selectedEl"
          class="text-[11px] font-syne text-center py-[8px]"
          style="color:rgba(0,128,96,0.55);"
        >{{ t('panel.selectHint') }}</p>

        <!-- Image-specific editing controls -->
        <template v-else-if="selectedEl.type === 'image'">
          <div class="rounded-[9px] p-[10px] flex flex-col gap-[10px]" style="background:#f8fafc; border:1px solid #e2e8f0;">
            <SliderRow :label="t('panel.size')"   :min="25"  :max="400" v-model="mobSize" :displayValue="mobSize + '%'" />
            <SliderRow :label="t('panel.rotate')" :min="0"   :max="360" v-model="mobRot"  :displayValue="mobRot + '°'" />
          </div>

          <!-- Flip -->
          <div class="flex gap-2">
            <button
              class="flex-1 py-[7px] rounded-[8px] text-[11px] font-bold font-syne active:scale-95"
              :style="selectedEl.flipX ? 'background:#008060;color:#fff;border:1px solid #008060;' : 'background:#f8fafc;color:#475569;border:1px solid #e2e8f0;'"
              @click="mobToggleFlip('flipX')"
            >{{ t('panel.hFlip') }}</button>
            <button
              class="flex-1 py-[7px] rounded-[8px] text-[11px] font-bold font-syne active:scale-95"
              :style="selectedEl.flipY ? 'background:#008060;color:#fff;border:1px solid #008060;' : 'background:#f8fafc;color:#475569;border:1px solid #e2e8f0;'"
              @click="mobToggleFlip('flipY')"
            >{{ t('panel.vFlip') }}</button>
          </div>

          <!-- Filter presets (horizontal scroll) -->
          <div class="overflow-x-auto scrollbar-none -mx-1 px-1">
            <div class="flex gap-[5px]" style="width: max-content;">
              <button
                v-for="p in MOB_FILTER_PRESETS"
                :key="p.key"
                class="px-3 py-[6px] rounded-[7px] text-[10px] font-syne font-bold flex-shrink-0 active:scale-95"
                :style="mobIsActivePreset(p) ? 'background:#008060;color:#fff;border:1px solid transparent;' : 'background:#f8fafc;color:#475569;border:1px solid #e2e8f0;'"
                @click="mobApplyPreset(p)"
              >{{ t('panel.' + p.key) }}</button>
            </div>
          </div>

          <!-- Crop -->
          <button
            class="w-full py-[8px] rounded-[9px] text-[11px] font-bold font-syne text-white active:opacity-75"
            style="background: linear-gradient(135deg, #475569, #334155);"
            @click="mobTriggerCrop"
          >{{ t('panel.cropImage') }}</button>
        </template>

        <!-- Generic adjust for non-image elements -->
        <template v-else>
          <div
            class="rounded-[9px] p-[10px] flex flex-col gap-[10px]"
            style="background:#f8fafc; border:1px solid #e2e8f0;"
          >
            <SliderRow :label="t('panel.size')"   :min="25"  :max="400" v-model="mobSize" :displayValue="mobSize + '%'" />
            <SliderRow :label="t('panel.rotate')" :min="0"   :max="360" v-model="mobRot"  :displayValue="mobRot + '°'" />
          </div>
          <ColorStrip v-model="mobAdjColor" />
        </template>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useCamera } from "@/composables/useCamera";
import { useCrop }   from "@/composables/useCrop";
import ColorStrip from "@/components/ui/ColorStrip.vue";
import FontPicker from "@/components/ui/FontPicker.vue";
import EmojiGrid  from "@/components/ui/EmojiGrid.vue";
import SliderRow  from "@/components/ui/SliderRow.vue";
import { STICKERS, ICONS, PRESETS } from "@/constants";
import { useCanvas } from "@/composables/useCanvas";
import { useToast }  from "@/composables/useToast";

defineProps<{ activePanel: string | null }>();

const { t } = useI18n()
const { addText, addSticker, addIcon, addImage, selectedEl, updateEl, saveUndo, curColor, curFont } = useCanvas();
const { showToast } = useToast();
const { openCrop }  = useCrop();

const mobTextInput      = ref<string>("");
const mobColor          = ref<string>(curColor.value);
const mobFont           = ref<string>(curFont.value);
const mobSize           = ref<number>(100);
const mobRot            = ref<number>(0);
const mobAdjColor       = ref<string>("#1a1a1a");
const mobBold           = ref<boolean>(true);
const mobShadow         = ref<boolean>(false);
const mobTextDecoration = ref<string>('');
const mobFontSize       = ref<number>(20);
const mobLetterSpacing  = ref<number>(0);
const mobTextEffect     = ref<string>('');

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

// ── Mobile text panel helpers ─────────────────────────────────────────────────

function adjustMobFontSize(delta: number): void {
  mobFontSize.value = Math.max(8, Math.min(72, mobFontSize.value + delta))
}

function adjustMobLetterSpacing(delta: number): void {
  mobLetterSpacing.value = Math.max(0, Math.min(20, mobLetterSpacing.value + delta))
}

function toggleMobDecoration(style: string): void {
  mobTextDecoration.value = mobTextDecoration.value === style ? '' : style
}

function toggleMobEffect(key: string): void {
  mobTextEffect.value = mobTextEffect.value === key ? '' : key
}

const mobStyleButtons = computed(() => [
  {
    key: 'bold',
    label: t('textEdit.bold'),
    labelStyle: 'font-weight:700;',
    active: mobBold.value,
    toggle: () => { mobBold.value = !mobBold.value },
  },
  {
    key: 'shadow',
    label: t('textEdit.shadow'),
    labelStyle: 'text-shadow:1px 1px 2px rgba(0,0,0,0.35);',
    active: mobShadow.value,
    toggle: () => { mobShadow.value = !mobShadow.value },
  },
  {
    key: 'underline',
    label: t('panel.underline'),
    labelStyle: 'text-decoration:underline;',
    active: mobTextDecoration.value === 'underline',
    toggle: () => toggleMobDecoration('underline'),
  },
  {
    key: 'strikethrough',
    label: t('panel.strikethrough'),
    labelStyle: 'text-decoration:line-through;',
    active: mobTextDecoration.value === 'line-through',
    toggle: () => toggleMobDecoration('line-through'),
  },
])

const mobEffectButtons = computed(() => [
  { key: 'outline',    icon: '◻',  label: t('panel.effectOutline') },
  { key: 'curved',     icon: '⌒',  label: t('panel.effectCurved') },
  { key: 'wave',       icon: '〜', label: t('panel.effectWave') },
  { key: '3d',         icon: '⬛', label: t('panel.effect3d') },
  { key: 'longshadow', icon: '◑',  label: t('panel.effectLongShadow') },
])

function submitText(): void {
  addText(mobTextInput.value, {
    bold:           mobBold.value,
    shadow:         mobShadow.value,
    fontSize:       mobFontSize.value,
    letterSpacing:  mobLetterSpacing.value,
    textDecoration: mobTextDecoration.value,
    textEffect:     mobTextEffect.value,
  });
  mobTextInput.value = "";
}

// ── Image editing ──
const MOB_FILTER_PRESETS = [
  { key: 'filterNormal',   brightness: 100, contrast: 100, saturate: 100, sepia: 0  },
  { key: 'filterVivid',    brightness: 100, contrast: 115, saturate: 160, sepia: 0  },
  { key: 'filterWarm',     brightness: 105, contrast: 100, saturate: 130, sepia: 30 },
  { key: 'filterFade',     brightness: 115, contrast: 80,  saturate: 70,  sepia: 0  },
  { key: 'filterBW',       brightness: 100, contrast: 110, saturate: 0,   sepia: 0  },
  { key: 'filterSepia',    brightness: 105, contrast: 100, saturate: 80,  sepia: 80 },
  { key: 'filterDrama',    brightness: 90,  contrast: 150, saturate: 60,  sepia: 10 },
]

function mobToggleFlip(field: 'flipX' | 'flipY'): void {
  if (selectedEl.value?.type !== 'image') return;
  saveUndo();
  updateEl(selectedEl.value.id, { [field]: !selectedEl.value[field] });
}

function mobIsActivePreset(p: (typeof MOB_FILTER_PRESETS)[0]): boolean {
  const el = selectedEl.value;
  if (!el) return false;
  return (
    (el.brightness ?? 100) === p.brightness &&
    (el.contrast   ?? 100) === p.contrast   &&
    (el.saturate   ?? 100) === p.saturate   &&
    (el.sepia      ?? 0)   === p.sepia
  );
}

function mobApplyPreset(p: (typeof MOB_FILTER_PRESETS)[0]): void {
  if (!selectedEl.value) return;
  saveUndo();
  updateEl(selectedEl.value.id, {
    brightness: p.brightness,
    contrast:   p.contrast,
    saturate:   p.saturate,
    sepia:      p.sepia,
  });
}

function mobTriggerCrop(): void {
  if (selectedEl.value?.type !== 'image') return;
  const id = selectedEl.value.id;
  openCrop(selectedEl.value.content, (dataUrl) => {
    saveUndo();
    updateEl(id, { content: dataUrl });
  });
}

// ── Image: URL ──
const urlMode  = ref(false);
const urlInput = ref('');

function addFromUrl(): void {
  const url = urlInput.value.trim();
  if (!url) { showToast(t('toast.enterImageUrl')); return; }
  if (!/^https?:\/\/.+/i.test(url)) { showToast(t('toast.urlMustStartHttp')); return; }
  addImage(url);
  urlInput.value = '';
  urlMode.value  = false;
}

function onFileChange(e: Event): void {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { showToast(t('toast.selectImageFile')); return; }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const src = ev.target?.result as string;
    if (src) addImage(src);
  };
  reader.readAsDataURL(file);
  (e.target as HTMLInputElement).value = '';
}

// ── Image: Camera ──
const { openCamera } = useCamera();
</script>
