import { ref, computed } from 'vue'
import { useHistory } from './useHistory'
import { useToast } from './useToast'
import { CANVAS_SIZE } from '@/constants'
import type { CanvasElement } from '@/types'

let _nextId = 1
function uid(): string { return `el_${_nextId++}_${Date.now()}` }
function rnd(a: number, b: number): number { return Math.floor(Math.random() * (b - a) + a) }

const elements = ref<CanvasElement[]>([])
const selectedId = ref<string | null>(null)
const canvasScale = ref<number>(1)
const curColor = ref<string>('#1a1a1a')
const curFont = ref<string>('Syne')

const selectedEl = computed<CanvasElement | null>(() =>
  elements.value.find(e => e.id === selectedId.value) ?? null,
)

const { saveUndo, doUndo, doRedo } = useHistory(elements)
const { showToast } = useToast()

function restoreElements(snap: CanvasElement[]): void {
  elements.value = snap
  selectedId.value = null
}

function addText(text: string): void {
  if (!text?.trim()) { showToast('✏️ Type something first'); return }
  saveUndo()
  elements.value.push({
    id: uid(), type: 'text', content: text.trim(),
    color: curColor.value, fontFamily: curFont.value,
    x: rnd(40, 130), y: rnd(70, 160),
    scale: 1, rotation: 0, opacity: 1,
  })
  showToast('✅ Text added')
}

function addSticker(s: string): void {
  saveUndo()
  elements.value.push({
    id: uid(), type: 'sticker', content: s,
    color: '', fontFamily: '',
    x: rnd(20, 170), y: rnd(50, 200),
    scale: 1, rotation: 0, opacity: 1,
  })
}

function addIcon(ic: string): void {
  saveUndo()
  elements.value.push({
    id: uid(), type: 'icon', content: ic,
    color: curColor.value, fontFamily: '',
    x: rnd(20, 170), y: rnd(50, 200),
    scale: 1, rotation: 0, opacity: 1,
  })
}

function removeEl(id: string): void {
  saveUndo()
  elements.value = elements.value.filter(e => e.id !== id)
  if (selectedId.value === id) selectedId.value = null
  showToast('🗑 Removed')
}

function selectEl(id: string): void {
  selectedId.value = id
}

function deselect(): void {
  selectedId.value = null
}

function updateEl(id: string, patch: Partial<CanvasElement>): void {
  const el = elements.value.find(e => e.id === id)
  if (el) Object.assign(el, patch)
}

function doClear(): void {
  if (!elements.value.length) return
  saveUndo()
  elements.value = []
  selectedId.value = null
  showToast('🗑 Cleared')
}

function undo(): void { doUndo(restoreElements, showToast) }
function redo(): void { doRedo(restoreElements, showToast) }

function zoom(factor: number): void {
  canvasScale.value = Math.max(0.5, Math.min(2.5, canvasScale.value * factor))
}

function addToCart(): void {
  if (!elements.value.length) { showToast('🎨 Add something first!'); return }
  showToast('🛒 Added to cart!')
  setTimeout(() => showToast('🎉 Personalization saved ✓'), 2400)
}

export function useCanvas() {
  return {
    elements,
    selectedId,
    selectedEl,
    canvasScale,
    curColor,
    curFont,
    addText,
    addSticker,
    addIcon,
    removeEl,
    selectEl,
    deselect,
    updateEl,
    doClear,
    undo,
    redo,
    zoom,
    addToCart,
    saveUndo,
  }
}
