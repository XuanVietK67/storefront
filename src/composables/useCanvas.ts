import { ref, computed } from 'vue'
import { useHistory } from './useHistory'
import { useToast } from './useToast'
import type { CanvasElement, CartOrder } from '@/types'

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

  // Deep-clone the current canvas state
  const snapshot: CanvasElement[] = JSON.parse(JSON.stringify(elements.value))
  const textLabels = snapshot.filter(e => e.type === 'text').map(e => e.content)

  const order: CartOrder = {
    orderId:  `order_${Date.now()}`,
    product:  'Classic Canvas Tote — Natural',
    price:    '$34.99',
    savedAt:  new Date().toISOString(),
    design: {
      elements:     snapshot,
      textLabels,
      elementCount: snapshot.length,
    },
  }

  // Persist to localStorage (overwrite with latest order)
  try {
    localStorage.setItem('custommaker_cart', JSON.stringify(order))
  } catch {
    // quota exceeded or private-browsing restriction — silent fail
  }

  console.log('[CustomMaker] Cart order saved:', order)

  // Confirmation toasts
  const designLabel = textLabels.length
    ? `"${textLabels[0]}"${textLabels.length > 1 ? ` +${textLabels.length - 1} more` : ''}`
    : `${snapshot.length} element${snapshot.length !== 1 ? 's' : ''}`

  showToast('🛒 Added to cart!')
  setTimeout(() => showToast(`✅ Design saved — ${designLabel}`), 2000)
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
