<template>
  <div class="flex flex-col gap-3">
    <!-- Add text -->
    <div class="flex flex-col gap-2">
      <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.addText') }}</p>
      <div class="relative">
        <input
          v-model="textInput"
          type="text"
          :placeholder="t('panel.typeSomething')"
          maxlength="28"
          autocomplete="off"
          class="w-full rounded-[8px] pl-3 pr-14 py-[10px] text-sm outline-none transition-all duration-150 placeholder:text-faint"
          style="background:#f8fafc; border:1.5px solid #e2e8f0; color:#0f172a; caret-color:#6366f1;"
          @focus="(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'"
          @blur="(e) => (e.target as HTMLInputElement).style.borderColor = '#e2e8f0'"
          @keydown.enter="submit"
        />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-syne tracking-wider text-faint border border-line rounded px-[5px] py-[2px] pointer-events-none select-none">↵</span>
      </div>
      <button
        class="group relative w-full h-[46px] rounded-[10px] font-dm font-semibold text-[14px] tracking-normal text-white flex items-center justify-center gap-2 overflow-hidden transition-all duration-200 hover:brightness-110 active:scale-[.97]"
        style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); box-shadow: 0 4px 14px rgba(99,102,241,0.30);"
        @click="submit"
        @mouseenter="hovered = true"
        @mouseleave="hovered = false"
      >
        <span class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[10px]"
          style="background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%);" />
        <span class="relative text-[16px] leading-none">✦</span>
        <span class="relative">{{ t('panel.add') }}</span>
      </button>
    </div>

    <div class="h-px bg-line" />

    <!-- Color -->
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.color') }}</p>
    <ColorStrip v-model="color" />

    <!-- Font family -->
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.fontFamilies') }}</p>
    <FontPicker v-model="font" />

    <div class="h-px bg-line" />

    <!-- Text style toggles: bold / shadow / underline / strikethrough -->
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.textStyle') }}</p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="btn in styleButtons"
        :key="btn.key"
        class="flex-1 min-w-[46px] h-[32px] rounded-[7px] text-[12px] font-semibold transition-all duration-150 active:scale-[.96]"
        :style="btn.active
          ? 'background:#6366f1; color:#fff; box-shadow:0 2px 8px rgba(99,102,241,0.30);'
          : 'background:#f1f5f9; color:#64748b; border:1.5px solid #e2e8f0;'"
        @click="btn.toggle()"
      >
        <span :style="btn.labelStyle">{{ btn.label }}</span>
      </button>
    </div>

    <div class="h-px bg-line" />

    <!-- Font size + letter spacing -->
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.fontSize') }}</p>
    <SliderRow v-model="fontSize"      :label="t('panel.fontSize')"      :min="8"  :max="72" :display-value="fontSize + 'px'" />

    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.letterSpacing') }}</p>
    <SliderRow v-model="letterSpacing" :label="t('panel.letterSpacing')" :min="0"  :max="20" :display-value="letterSpacing + 'px'" />

    <div class="h-px bg-line" />

    <!-- Text effects -->
    <p class="font-syne text-[9px] font-bold tracking-[.1em] uppercase text-faint">{{ t('panel.textEffects') }}</p>
    <div class="grid grid-cols-3 gap-[6px]">
      <button
        v-for="eff in effects"
        :key="eff.key"
        class="h-[42px] rounded-[8px] flex flex-col items-center justify-center gap-[2px] transition-all duration-150 active:scale-[.96]"
        :style="textEffect === eff.key
          ? 'background:#6366f1; color:#fff; box-shadow:0 2px 10px rgba(99,102,241,0.32);'
          : 'background:#f1f5f9; color:#64748b; border:1.5px solid #e2e8f0;'"
        @click="toggleEffect(eff.key)"
      >
        <span class="text-[15px] leading-none">{{ eff.icon }}</span>
        <span class="text-[9px] font-syne font-bold tracking-wide leading-none">{{ eff.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ColorStrip from '@/components/ui/ColorStrip.vue'
import FontPicker from '@/components/ui/FontPicker.vue'
import SliderRow  from '@/components/ui/SliderRow.vue'
import { useCanvas } from '@/composables/useCanvas'

const { t } = useI18n()
const { addText, curColor, curFont, selectedEl, updateEl, saveUndo } = useCanvas()

const textInput      = ref<string>('')
const color          = ref<string>(curColor.value)
const font           = ref<string>(curFont.value)
const bold           = ref<boolean>(true)
const shadow         = ref<boolean>(false)
const fontSize       = ref<number>(20)
const letterSpacing  = ref<number>(0)
const textDecoration = ref<string>('')
const textEffect     = ref<string>('')
const hovered        = ref<boolean>(false)
let   snapshotSaved  = false

// ── Sync panel ↔ selected element ────────────────────────────────────────────

watch(selectedEl, el => {
  if (el?.type === 'text') {
    color.value          = el.color
    font.value           = el.fontFamily || curFont.value
    bold.value           = el.bold !== false
    shadow.value         = el.shadow ?? false
    fontSize.value       = el.fontSize ?? 20
    letterSpacing.value  = el.letterSpacing ?? 0
    textDecoration.value = el.textDecoration ?? ''
    textEffect.value     = el.textEffect ?? ''
  }
  snapshotSaved = false
}, { immediate: true })

function ensureSnapshot(): void {
  if (!snapshotSaved) { saveUndo(); snapshotSaved = true }
}

// ── Watchers that push changes to the canvas ──────────────────────────────────

watch(color, v => {
  curColor.value = v
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { color: v }) }
})
watch(font, v => {
  curFont.value = v
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { fontFamily: v }) }
})
watch(fontSize, v => {
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { fontSize: v }) }
})
watch(letterSpacing, v => {
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { letterSpacing: v }) }
})

// ── Toggle helpers ────────────────────────────────────────────────────────────

function toggleBold(): void {
  bold.value = !bold.value
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { bold: bold.value }) }
}
function toggleShadow(): void {
  shadow.value = !shadow.value
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { shadow: shadow.value }) }
}
function toggleDecoration(style: string): void {
  textDecoration.value = textDecoration.value === style ? '' : style
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { textDecoration: textDecoration.value }) }
}
function toggleEffect(key: string): void {
  textEffect.value = textEffect.value === key ? '' : key
  if (selectedEl.value?.type === 'text') { ensureSnapshot(); updateEl(selectedEl.value.id, { textEffect: textEffect.value }) }
}

// ── Style-button descriptors (computed for locale reactivity) ─────────────────

const styleButtons = computed(() => [
  {
    key: 'bold',
    label: t('panel.bold'),
    labelStyle: 'font-weight:700;',
    active: bold.value,
    toggle: toggleBold,
  },
  {
    key: 'shadow',
    label: t('panel.shadow'),
    labelStyle: 'text-shadow:1px 1px 2px rgba(0,0,0,0.4);',
    active: shadow.value,
    toggle: toggleShadow,
  },
  {
    key: 'underline',
    label: t('panel.underline'),
    labelStyle: 'text-decoration:underline;',
    active: textDecoration.value === 'underline',
    toggle: () => toggleDecoration('underline'),
  },
  {
    key: 'strikethrough',
    label: t('panel.strikethrough'),
    labelStyle: 'text-decoration:line-through;',
    active: textDecoration.value === 'line-through',
    toggle: () => toggleDecoration('line-through'),
  },
])

// ── Effect-button descriptors (computed for locale reactivity) ────────────────

const effects = computed(() => [
  { key: 'outline',    icon: '◻',  label: t('panel.effectOutline') },
  { key: 'curved',     icon: '⌒',  label: t('panel.effectCurved') },
  { key: 'wave',       icon: '〜',  label: t('panel.effectWave') },
  { key: '3d',         icon: '⬛', label: t('panel.effect3d') },
  { key: 'longshadow', icon: '◑',  label: t('panel.effectLongShadow') },
])

function submit(): void { addText(textInput.value); textInput.value = '' }
</script>
