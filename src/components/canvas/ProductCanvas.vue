<template>
  <div
    class="relative flex-shrink-0 rounded-[18px] overflow-visible"
    :style="{
      width: canvasWidth + 'px',
      height: canvasHeight + 'px',
      boxShadow:
        '0 0 0 1px rgba(0,0,0,.06), 0 24px 80px rgba(0,0,0,.14), 0 8px 24px rgba(0,0,0,.08)',
    }"
  >
    <!-- Bag background (DOM, sits behind the transparent Konva canvas) -->
    <div class="absolute inset-0 rounded-[18px] overflow-hidden">
      <BagSvg />
    </div>

    <!-- Konva Stage (transparent canvas layered over the bag) -->
    <div class="absolute inset-0 rounded-[18px] overflow-hidden">
      <v-stage
        ref="stageRef"
        :config="stageConfig"
        @click="onStageClick"
        @tap="onStageClick"
      >
        <v-layer ref="layerRef">
          <!-- Print-zone boundary — dashed rect that matches the bag body -->
          <v-rect :config="zoneIndicatorConfig" />

          <v-group
            v-for="el in elements"
            :key="el.id"
            :config="groupConfig(el)"
            @mousedown="onGroupPointerDown($event, el.id)"
            @touchstart="onGroupPointerDown($event, el.id)"
            @click="onGroupClick($event, el.id)"
            @tap="onGroupClick($event, el.id)"
            @mouseenter="showHint"
            @dragstart="onDragStart($event, el.id)"
            @dragmove="updateDeletePos"
            @dragend="onDragEnd($event, el.id)"
            @transformend="onTransformEnd($event, el.id)"
          >
            <v-text
              v-if="el.type === 'text' && (!el.textEffect || el.textEffect === '' || el.textEffect === 'outline')"
              :config="textNodeConfig(el)"
            />
            <v-image
              v-else-if="el.type === 'text' && textEffectCanvases[el.id]"
              :config="textEffectImageConfig(el)"
            />
            <v-text
              v-else-if="el.type === 'sticker'"
              :config="stickerNodeConfig(el)"
            />
            <v-text
              v-else-if="el.type === 'icon'"
              :config="iconNodeConfig(el)"
            />
            <v-image
              v-else-if="el.type === 'image'"
              :config="imageNodeConfig(el)"
            />
          </v-group>

          <v-transformer ref="transformerRef" :config="transformerConfig" />
        </v-layer>
      </v-stage>
    </div>

    <!-- Delete button (HTML overlay, positioned from Konva bounding box) -->
    <button
      v-if="selectedId && deletePos"
      class="absolute w-[21px] h-[21px] bg-danger border-2 border-app rounded-full flex items-center justify-center text-[11px] text-white cursor-pointer z-20"
      :style="{
        top: deletePos.y + 'px',
        left: deletePos.x + 'px',
        transform: 'translate(-50%, -50%)',
      }"
      @click.stop="$emit('remove', selectedId)"
    >
      ×
    </button>

    <!-- Hover hint -->
    <div
      class="absolute -bottom-[38px] left-1/2 -translate-x-1/2 bg-[rgba(18,17,14,.93)] border border-line text-faint text-[10px] font-syne tracking-[.06em] px-3 py-[3px] rounded-[20px] whitespace-nowrap backdrop-blur-[10px] pointer-events-none transition-opacity duration-300"
      :class="hintVisible ? 'opacity-100' : 'opacity-0'"
    >
      {{ t('canvas.hint') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, reactive, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import Konva from "konva";
import BagSvg from "./BagSvg.vue";
import { CANVAS_SIZE, PRINT_ZONE } from "@/constants";
import type { CanvasElement } from "@/types";
import { buildTextEffectCanvas } from "@/utils/textEffects";

const props = defineProps<{
  elements: CanvasElement[];
  selectedId: string | null;
  canvasScale: number;
  canvasWidth: number;
  canvasHeight: number;
}>();

const emit = defineEmits<{
  select: [id: string];
  remove: [id: string];
  move: [payload: { id: string; x: number; y: number }];
  resize: [payload: { id: string; scale: number; rotation: number }];
  deselect: [];
}>();

const { t } = useI18n()

const stageRef = ref();
const layerRef = ref();
const transformerRef = ref();

// ── Image loading ─────────────────────────────────────────────────────────────

const loadedImages = reactive<Record<string, HTMLImageElement>>({});
const filteredCanvases = reactive<Record<string, HTMLCanvasElement>>({});

// Load images as they appear in elements
watchEffect(() => {
  props.elements.forEach((el) => {
    if (el.type === "image" && el.content && !loadedImages[el.content]) {
      const img = new window.Image();
      // Bug fix: crossOrigin must not be set for data URLs — it causes canvas-tainting
      // errors in some browsers. Only set it for remote http/https sources.
      if (el.content.startsWith("http")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => {
        loadedImages[el.content] = img;
        buildFilterCanvas(el, img);
      };
      img.src = el.content;
    }
  });
});

// Rebuild the filter canvas whenever brightness/contrast/saturate/sepia change
watch(
  () =>
    props.elements
      .filter((e) => e.type === "image")
      .map((e) => ({
        id: e.id,
        content: e.content,
        b: e.brightness,
        c: e.contrast,
        s: e.saturate,
        sp: e.sepia,
      })),
  (snapshots) => {
    snapshots.forEach((snap) => {
      const img = loadedImages[snap.content];
      if (!img) return;
      const el = props.elements.find((e) => e.id === snap.id);
      if (el) buildFilterCanvas(el, img);
    });
  },
  { deep: true },
);

function buildFilterCanvas(el: CanvasElement, img: HTMLImageElement): void {
  const maxSize = 120;
  const ratio = Math.min(
    maxSize / img.naturalWidth,
    maxSize / img.naturalHeight,
    1,
  );
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  const b = el.brightness ?? 100;
  const c = el.contrast ?? 100;
  const s = el.saturate ?? 100;
  const sp = el.sepia ?? 0;
  if (!(b === 100 && c === 100 && s === 100 && sp === 0)) {
    ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) sepia(${sp}%)`;
  }
  ctx.drawImage(img, 0, 0, w, h);
  filteredCanvases[el.id] = canvas;
}

// ── Text effect canvases ──────────────────────────────────────────────────────

const textEffectCanvases = reactive<Record<string, HTMLCanvasElement>>({})

watch(
  () =>
    props.elements
      .filter(e => e.type === 'text')
      .map(e => ({
        id: e.id, content: e.content, fontFamily: e.fontFamily,
        fontSize: e.fontSize, bold: e.bold, color: e.color,
        letterSpacing: e.letterSpacing, textEffect: e.textEffect, shadow: e.shadow,
      })),
  (snapshots) => {
    const liveIds = new Set(snapshots.map(s => s.id))

    // Remove canvases for deleted elements
    for (const id of Object.keys(textEffectCanvases)) {
      if (!liveIds.has(id)) delete textEffectCanvases[id]
    }

    // Build / rebuild for elements that need an offscreen canvas
    for (const snap of snapshots) {
      const el = props.elements.find(e => e.id === snap.id)
      if (!el) continue
      if (snap.textEffect && snap.textEffect !== '' && snap.textEffect !== 'outline') {
        const canvas = buildTextEffectCanvas(el)
        if (canvas) textEffectCanvases[snap.id] = canvas
      } else if (textEffectCanvases[snap.id]) {
        delete textEffectCanvases[snap.id]
      }
    }
  },
  { deep: true, immediate: true },
)

// ── Print-zone indicator ──────────────────────────────────────────────────────

const zoneIndicatorConfig = {
  x:           PRINT_ZONE.x,
  y:           PRINT_ZONE.y,
  width:       PRINT_ZONE.w,
  height:      PRINT_ZONE.h,
  cornerRadius: 6,
  stroke:       'rgba(99,102,241,0.45)',
  strokeWidth:  1,
  dash:         [5, 4],
  fill:         'transparent',
  listening:    false,
}

// ── Stage / Transformer config ────────────────────────────────────────────────

const stageScale = computed(
  () => (props.canvasWidth / CANVAS_SIZE.w) * props.canvasScale,
);

const stageConfig = computed(() => ({
  width: props.canvasWidth,
  height: props.canvasHeight,
  scaleX: stageScale.value,
  scaleY: stageScale.value,
}));

const transformerConfig = {
  enabledAnchors: ["top-left", "top-right", "bottom-left", "bottom-right"],
  rotateEnabled: true,
  keepRatio: true,
  borderStroke: "#6366f1",
  borderStrokeWidth: 1.5,
  anchorStroke: "#6366f1",
  anchorFill: "#fff",
  anchorSize: 8,
  anchorCornerRadius: 4,
  padding: 4,
};

// ── Transformer + delete button sync ─────────────────────────────────────────

// immediate: true so the transformer attaches if selectedId is already set on mount
watch(
  () => props.selectedId,
  async () => {
    await nextTick();
    updateTransformer();
    updateDeletePos();
  },
  { immediate: true },
);

// Recompute delete-button position when any element changes (e.g. panel edits)
watch(
  () => props.elements,
  async () => {
    await nextTick();
    updateDeletePos();
  },
  { deep: true },
);

function updateTransformer(): void {
  const tr = transformerRef.value?.getNode();
  const stage = stageRef.value?.getStage();
  if (!tr || !stage) return;
  if (props.selectedId) {
    const group = stage.findOne(`#${props.selectedId}`);
    tr.nodes(group ? [group] : []);
  } else {
    tr.nodes([]);
  }
  layerRef.value?.getNode()?.batchDraw();
}

const deletePos = ref<{ x: number; y: number } | null>(null);

function updateDeletePos(): void {
  if (!props.selectedId) {
    deletePos.value = null;
    return;
  }
  const stage = stageRef.value?.getStage();
  if (!stage) return;
  const group = stage.findOne(`#${props.selectedId}`);
  if (!group) {
    deletePos.value = null;
    return;
  }
  // getClientRect() returns coords in stage-canvas pixel space (= CSS px from container top-left)
  const box = group.getClientRect();
  deletePos.value = { x: box.x + box.width, y: box.y };
}

// ── Node config builders ──────────────────────────────────────────────────────

function groupConfig(el: CanvasElement) {
  return {
    id: el.id,
    x: el.x,
    y: el.y,
    // Flip is intentionally NOT encoded here. Applying a negative scaleX/scaleY on
    // the group would mirror around the group's origin (top-left corner of the content),
    // causing the image to jump sideways by its full width. Instead, flip is applied
    // directly on the image node with an offsetting x/y so the image stays in place.
    scaleX: el.scale,
    scaleY: el.scale,
    rotation: el.rotation,
    opacity: el.opacity,
    draggable: true,
    dragBoundFunc(pos: { x: number; y: number }) {
      const sc = stageScale.value;
      const stage = stageRef.value?.getStage();
      if (!stage) return pos;

      const group = stage.findOne(`#${el.id}`);
      if (!group) return pos;

      // AABB in canvas pixels — accounts for rotation, scale, and all children.
      const rect = group.getClientRect();
      const absPos = group.absolutePosition();

      // Offset from the group's origin to the AABB top-left.
      // This depends only on content size + rotation, so it's constant during drag.
      const offsetX = rect.x - absPos.x;
      const offsetY = rect.y - absPos.y;

      // Print zone boundaries in canvas pixels.
      const pzLeft   = PRINT_ZONE.x * sc;
      const pzTop    = PRINT_ZONE.y * sc;
      const pzRight  = (PRINT_ZONE.x + PRINT_ZONE.w) * sc;
      const pzBottom = (PRINT_ZONE.y + PRINT_ZONE.h) * sc;

      // Clamp the origin so every corner of the AABB stays inside the print zone.
      return {
        x: Math.max(pzLeft - offsetX, Math.min(pzRight - offsetX - rect.width, pos.x)),
        y: Math.max(pzTop - offsetY, Math.min(pzBottom - offsetY - rect.height, pos.y)),
      };
    },
  };
}

function textNodeConfig(el: CanvasElement) {
  const isOutline = el.textEffect === 'outline'
  const strokeW   = isOutline ? Math.max(1, Math.round((el.fontSize ?? 20) * 0.07)) : 0
  return {
    text:            el.content,
    fontSize:        el.fontSize ?? 20,
    fontFamily:      el.fontFamily,
    fill:            isOutline ? '' : el.color,
    fontStyle:       el.bold === false ? 'normal' : 'bold',
    padding:         2,
    shadowEnabled:   el.shadow ?? false,
    shadowColor:     'rgba(0,0,0,0.45)',
    shadowBlur:      6,
    shadowOffsetX:   2,
    shadowOffsetY:   3,
    letterSpacing:   el.letterSpacing ?? 0,
    textDecoration:  el.textDecoration ?? '',
    stroke:          isOutline ? el.color : undefined,
    strokeWidth:     strokeW,
  }
}

function textEffectImageConfig(el: CanvasElement) {
  const canvas = textEffectCanvases[el.id]
  if (!canvas) return { x: 0, y: 0, width: 0, height: 0, listening: false }
  return { image: canvas, x: 0, y: 0, width: canvas.width, height: canvas.height }
}

function stickerNodeConfig(el: CanvasElement) {
  return {
    text: el.content,
    fontSize: 44,
  };
}

function iconNodeConfig(el: CanvasElement) {
  return {
    text: el.content,
    fontSize: 36,
    fill: el.color,
  };
}

function imageNodeConfig(el: CanvasElement) {
  const source = filteredCanvases[el.id] ?? loadedImages[el.content];
  // No source yet — return a zero-size placeholder; listening:false is safe here
  // because the group itself still has no hittable area until the image loads.
  if (!source) return { x: 0, y: 0, width: 0, height: 0, listening: false };
  const w = (source as HTMLCanvasElement).width || 120;
  const h = (source as HTMLCanvasElement).height || 120;

  // Flip is applied here (not on the group) to keep the image in place.
  // scaleX=-1 mirrors around x=0, which would push the image off to the left.
  // Offsetting x by w (the image's own width) slides it back so it renders
  // over exactly the same region as the unflipped version. Same logic for Y.
  const flipX = el.flipX ? -1 : 1;
  const flipY = el.flipY ? -1 : 1;
  return {
    image: source,
    x: el.flipX ? w : 0,
    y: el.flipY ? h : 0,
    width: w,
    height: h,
    scaleX: flipX,
    scaleY: flipY,
    cornerRadius: 4,
  };
}

// ── Event handlers ────────────────────────────────────────────────────────────

function onStageClick(e: any): void {
  if (e.target === stageRef.value?.getStage()) {
    emit("deselect");
  }
}

// Bug fix: use mousedown/touchstart instead of dragstart for selection.
// dragstart fires after the pointer has already moved, so emitting 'select' there
// would trigger a re-render mid-drag and cause vue-konva to call setAttrs({x, y})
// with the pre-drag coordinates, snapping the element back to its original position.
// mousedown fires before any movement, so the re-render happens while the group is
// still at its stored position — no conflict with Konva's drag tracking.
function onGroupPointerDown(e: any, id: string): void {
  e.cancelBubble = true;
  emit("select", id);
}

// click fires only when there was no drag; cancels bubble so the stage
// @click handler does not fire and deselect the element we just selected.
function onGroupClick(e: any, id: string): void {
  e.cancelBubble = true;
  emit("select", id);
}

function onDragStart(e: any, id: string): void {
  const group = e.target;
  const el = props.elements.find((el) => el.id === id);
  if (!el) return;
  group.to({
    scaleX: el.scale * 1.07,
    scaleY: el.scale * 1.07,
    opacity: Math.min(el.opacity ?? 1, 0.82),
    shadowEnabled: true,
    shadowColor: "rgba(0,0,0,0.28)",
    shadowBlur: 20,
    shadowOffsetX: 0,
    shadowOffsetY: 8,
    duration: 0.12,
    easing: Konva.Easings.EaseOut,
  });
}

function onDragEnd(e: any, id: string): void {
  const group = e.target;
  const el = props.elements.find((el) => el.id === id);
  const newX = group.x();
  const newY = group.y();
  updateDeletePos();
  group.to({
    scaleX: el?.scale ?? group.scaleX(),
    scaleY: el?.scale ?? group.scaleY(),
    opacity: el?.opacity ?? 1,
    shadowEnabled: false,
    duration: 0.18,
    easing: Konva.Easings.EaseOut,
    onFinish: () => emit("move", { id, x: newX, y: newY }),
  });
}

function onTransformEnd(e: any, id: string): void {
  const group = e.target;
  const el = props.elements.find((el) => el.id === id);
  if (!el) return;

  const newScale = Math.max(0.25, Math.min(4, Math.abs(group.scaleX())));
  const newRotation = group.rotation();
  const newX = group.x();
  const newY = group.y();

  // Reset scale to the clamped value so cumulative transforms don't drift.
  // Flip is encoded on the image node (not the group), so we never set a
  // negative scaleX/scaleY here.
  group.scaleX(newScale);
  group.scaleY(newScale);

  emit("resize", { id, scale: newScale, rotation: newRotation });
  emit("move", { id, x: newX, y: newY });

  nextTick(updateDeletePos);
}

// ── Hint ──────────────────────────────────────────────────────────────────────

const hintVisible = ref(false);
let hintTimer: ReturnType<typeof setTimeout> | null = null;

function showHint(): void {
  hintVisible.value = true;
  if (hintTimer) clearTimeout(hintTimer);
  hintTimer = setTimeout(() => {
    hintVisible.value = false;
  }, 1400);
}
</script>
