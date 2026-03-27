<template>
  <div
    class="flex flex-col h-dvh overflow-hidden bg-app text-fore font-dm text-sm leading-[1.5]"
  >
    <TopBar />

    <div class="flex-1 flex overflow-hidden min-h-0">
      <!-- Sidebar: hidden on mobile, visible md+ -->
      <Sidebar
        class="hidden md:flex"
        :activeTool="activeTool"
        @setTool="setTool"
      />

      <!-- Canvas area -->
      <main
        class="flex-1 min-w-0 flex flex-col items-center justify-center relative overflow-hidden"
        style="
          background: radial-gradient(
            ellipse at 56% 36%,
            #e8eeff 0%,
            #f5f7ff 68%
          );
        "
      >
        <!-- Dot grid overlay -->
        <div class="absolute inset-0 pointer-events-none canvas-dot-grid" />

        <!-- Glow -->
        <div
          class="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
          style="
            background: radial-gradient(
              circle,
              rgba(99, 102, 241, 0.07),
              transparent 68%
            );
            top: -5%;
            left: 50%;
            transform: translateX(-50%);
          "
        />

        <ProductCanvas
          :elements="elements"
          :selected-id="selectedId"
          :canvas-scale="canvasScale"
          :canvas-width="cvW"
          :canvas-height="cvH"
          @select="selectEl"
          @remove="removeEl"
          @move="({ id, x, y }) => updateEl(id, { x, y })"
          @resize="({ id, scale, rotation }) => updateEl(id, { scale, rotation })"
          @deselect="deselect"
        />

        <!-- Zoom controls (tablet/desktop) -->
        <div
          class="absolute bottom-[18px] right-[18px] hidden md:flex flex-col items-center gap-[3px]"
        >
          <button
            class="w-[30px] h-[30px] rounded-[7px] border border-line2 bg-[rgba(255,255,255,0.92)] text-muted text-[15px] flex items-center justify-center cursor-pointer backdrop-blur-[10px] transition-all hover:text-fore hover:bg-surface shadow-sm"
            @click="zoom(1.15)"
          >
            +
          </button>
          <span class="text-[9px] font-syne text-faint tracking-[.05em]">
            {{ Math.round(canvasScale * 100) }}%
          </span>
          <button
            class="w-[30px] h-[30px] rounded-[7px] border border-line2 bg-[rgba(255,255,255,0.92)] text-muted text-[15px] flex items-center justify-center cursor-pointer backdrop-blur-[10px] transition-all hover:text-fore hover:bg-surface shadow-sm"
            @click="zoom(1 / 1.15)"
          >
            −
          </button>
        </div>
      </main>

      <!-- Right panel: hidden on mobile, visible md+ -->
      <RightPanel class="hidden md:flex" :activeTool="activeTool" />
    </div>

    <!-- Mobile: inline text editor replaces toolbar when a text element is selected; hide both when camera is open -->
    <template v-if="!cameraOpen">
      <MobileTextEditBar v-if="selectedEl?.type === 'text'" />
      <MobileToolbar
        v-else
        :activePanel="activeMobPanel"
        @toggle="toggleMobPanel"
      />
    </template>

    <!-- Mobile panels: hidden while text editing to keep the layout uncluttered -->
    <MobilePanels
      v-if="selectedEl?.type !== 'text'"
      :activePanel="activeMobPanel"
    />

    <!-- Mobile CTA -->
    <MobileCta />

    <!-- Toast notification -->
    <Toast />

    <!-- Crop modal (singleton, controlled via useCrop) -->
    <CropModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import TopBar from "@/components/TopBar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ProductCanvas from "@/components/canvas/ProductCanvas.vue";
import RightPanel from "@/components/RightPanel.vue";
import MobileToolbar from "@/components/MobileToolbar.vue";
import MobileTextEditBar from "@/components/MobileTextEditBar.vue";
import MobilePanels from "@/components/MobilePanels.vue";
import MobileCta from "@/components/MobileCta.vue";
import Toast from "@/components/Toast.vue";
import CropModal from "@/components/CropModal.vue";

import { useCanvas } from "@/composables/useCanvas";
import { useCamera } from "@/composables/useCamera";

const {
  elements,
  selectedId,
  selectedEl,
  canvasScale,
  selectEl,
  deselect,
  removeEl,
  updateEl,
  addSticker,
  undo,
  redo,
  doClear,
  zoom,
} = useCanvas();

const { cameraOpen } = useCamera();

// Active tool (right panel / sidebar)
const activeTool = ref("text");
const activeMobPanel = ref("mp-text");

function setTool(key) {
  activeTool.value = key;
}

function toggleMobPanel(panelId) {
  activeMobPanel.value = activeMobPanel.value === panelId ? null : panelId;
}

// Responsive canvas dimensions via CSS breakpoints
const cvW = ref(268);
const cvH = ref(308);

function updateCanvasSize() {
  const w = window.innerWidth;
  if (w >= 1600) {
    cvW.value = 396;
    cvH.value = 452;
  } else if (w >= 1280) {
    cvW.value = 350;
    cvH.value = 400;
  } else if (w >= 1024) {
    cvW.value = 316;
    cvH.value = 362;
  } else if (w >= 768) {
    cvW.value = 294;
    cvH.value = 336;
  } else if (w >= 390) {
    cvW.value = 232;
    cvH.value = 264;
  } else {
    cvW.value = 200;
    cvH.value = 228;
  }
}

// Keyboard shortcuts
function onKeyDown(e) {
  const active = document.activeElement;
  const isInput = active?.tagName === "INPUT" || active?.tagName === "TEXTAREA";
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
  if (
    (e.ctrlKey || e.metaKey) &&
    (e.key === "y" || (e.shiftKey && e.key === "z"))
  ) {
    e.preventDefault();
    redo();
  }
  if (
    (e.key === "Delete" || e.key === "Backspace") &&
    selectedId.value &&
    !isInput
  ) {
    e.preventDefault();
    removeEl(selectedId.value);
  }
  if (e.key === "Escape") deselect();
}

onMounted(() => {
  updateCanvasSize();
  window.addEventListener("resize", updateCanvasSize);
  document.addEventListener("keydown", onKeyDown);

  // Seed a starter sticker
  setTimeout(() => {
    // addSticker('⚡')
    if (elements.value.length) {
      updateEl(elements.value[0].id, { x: 96, y: 128 });
      deselect();
    }
  }, 120);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCanvasSize);
  document.removeEventListener("keydown", onKeyDown);
});
</script>
