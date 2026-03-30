import { ref, computed } from 'vue'
import { useHistory } from './useHistory'
import { useToast } from './useToast'
import { i18n } from '@/i18n'
import type { CanvasElement, CartOrder, SavedDesign } from '@/types'

function t(key: string): string {
  return i18n.global.t(key) as string
}

const STORAGE_KEY = 'custommaker_design'

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

interface TextStyleOptions {
  bold?: boolean
  shadow?: boolean
  fontSize?: number
  letterSpacing?: number
  textDecoration?: string
  textEffect?: string
}

function addText(text: string, opts: TextStyleOptions = {}): void {
  if (!text?.trim()) { showToast(t('toast.typeSomethingFirst')); return }
  saveUndo()
  elements.value.push({
    id: uid(), type: 'text', content: text.trim(),
    color: curColor.value, fontFamily: curFont.value,
    x: rnd(40, 130), y: rnd(70, 160),
    scale: 1, rotation: 0, opacity: 1,
    ...(opts.bold           !== undefined && { bold:           opts.bold }),
    ...(opts.shadow         !== undefined && { shadow:         opts.shadow }),
    ...(opts.fontSize       !== undefined && { fontSize:       opts.fontSize }),
    ...(opts.letterSpacing  !== undefined && { letterSpacing:  opts.letterSpacing }),
    ...(opts.textDecoration !== undefined && { textDecoration: opts.textDecoration }),
    ...(opts.textEffect     !== undefined && { textEffect:     opts.textEffect }),
  })
  showToast(t('toast.textAdded'))
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

function addImage(src: string): void {
  saveUndo()
  elements.value.push({
    id: uid(), type: 'image', content: src,
    color: '', fontFamily: '',
    x: rnd(30, 120), y: rnd(50, 180),
    scale: 1, rotation: 0, opacity: 1,
  })
  showToast(t('toast.imageAdded'))
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
  showToast(t('toast.removed'))
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
  showToast(t('toast.cleared'))
}

function undo(): void { doUndo(restoreElements, showToast) }
function redo(): void { doRedo(restoreElements, showToast) }

function zoom(factor: number): void {
  canvasScale.value = Math.max(0.5, Math.min(2.5, canvasScale.value * factor))
}

function saveDesign(): void {
  if (!elements.value.length) { showToast(t('toast.nothingToSave')); return }

  const saved: SavedDesign = {
    version: '1',
    savedAt: new Date().toISOString(),
    elements: JSON.parse(JSON.stringify(elements.value)),
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // quota exceeded or private-browsing — silent fail
  }

  console.log('[CustomMaker] Design saved:', saved)
  showToast(t('toast.designSaved'))
}

function loadDesign(): void {
  let raw: string | null = null
  try { raw = localStorage.getItem(STORAGE_KEY) } catch { /* ignore */ }
  if (!raw) { showToast(t('toast.noSavedDesign')); return }

  let saved: SavedDesign
  try { saved = JSON.parse(raw) } catch { showToast(t('toast.corruptedData')); return }

  saveUndo()
  restoreElements(saved.elements)
  console.log('[CustomMaker] Design restored:', saved)
  showToast(t('toast.designRestored'))
}

function addToCart(): void {
  if (!elements.value.length) { showToast(t('toast.addSomethingFirst')); return }

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

  showToast(t('toast.addedToCart'))
  setTimeout(() => showToast(`✅ ${designLabel}`), 2000)
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
    addImage,
    removeEl,
    selectEl,
    deselect,
    updateEl,
    doClear,
    undo,
    redo,
    zoom,
    addToCart,
    saveDesign,
    loadDesign,
    saveUndo,
  }
}
