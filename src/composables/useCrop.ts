import { ref, type Ref } from 'vue'

// ── Shared singleton state ──────────────────────────────────────────────────
const cropOpen: Ref<boolean>          = ref(false)
const cropSrc:  Ref<string>           = ref('')
const cropCanvas: Ref<HTMLCanvasElement | null> = ref(null)

let _onConfirm: ((dataUrl: string) => void) | null = null

// Internal crop geometry (display-space pixels)
let displayW = 0, displayH = 0
let cropX = 0,  cropY = 0,  cropW = 0,  cropH = 0

// Drag
type DragMode = 'none' | 'move' | 'tl' | 'tr' | 'bl' | 'br'
let dragMode: DragMode = 'none'
let dragStartX = 0, dragStartY = 0
let cropStartX = 0, cropStartY = 0, cropStartW = 0, cropStartH = 0

const cropImg = new Image()

// ── Public API ──────────────────────────────────────────────────────────────
function openCrop(src: string, onConfirm: (dataUrl: string) => void): void {
  cropSrc.value  = src
  _onConfirm     = onConfirm
  cropOpen.value = true
}

function closeCrop(): void {
  cropOpen.value = false
  dragMode       = 'none'
}

function initCropCanvas(): void {
  const canvas = cropCanvas.value
  if (!canvas) return

  cropImg.onload = () => {
    const maxW  = canvas.offsetWidth || 380
    const maxH  = 440
    const ratio = Math.min(maxW / cropImg.naturalWidth, maxH / cropImg.naturalHeight, 1)
    displayW = Math.round(cropImg.naturalWidth  * ratio)
    displayH = Math.round(cropImg.naturalHeight * ratio)
    canvas.width  = displayW
    canvas.height = displayH
    cropX = 0; cropY = 0; cropW = displayW; cropH = displayH
    drawCrop()
  }
  cropImg.crossOrigin = cropSrc.value.startsWith('data:') ? '' : 'anonymous'
  cropImg.src = cropSrc.value
}

function drawCrop(): void {
  const canvas = cropCanvas.value
  if (!canvas || !cropImg.complete) return
  const ctx = canvas.getContext('2d')!

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Dimmed full image
  ctx.globalAlpha = 0.4
  ctx.drawImage(cropImg, 0, 0, displayW, displayH)

  // Bright crop region
  ctx.save()
  ctx.beginPath()
  ctx.rect(cropX, cropY, cropW, cropH)
  ctx.clip()
  ctx.globalAlpha = 1
  ctx.drawImage(cropImg, 0, 0, displayW, displayH)
  ctx.restore()

  ctx.globalAlpha = 1

  // Crop border
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth   = 1.5
  ctx.strokeRect(cropX + 0.75, cropY + 0.75, cropW - 1.5, cropH - 1.5)

  // Rule-of-thirds grid
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.lineWidth   = 0.5
  for (let i = 1; i < 3; i++) {
    const gx = cropX + (cropW * i) / 3
    const gy = cropY + (cropH * i) / 3
    ctx.beginPath(); ctx.moveTo(gx, cropY); ctx.lineTo(gx, cropY + cropH); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cropX, gy); ctx.lineTo(cropX + cropW, gy); ctx.stroke()
  }

  // Corner handles
  const hs = 8
  ctx.fillStyle = '#ffffff'
  for (const [hx, hy] of _handles()) {
    ctx.fillRect(hx - hs / 2, hy - hs / 2, hs, hs)
  }
}

function _handles(): [number, number][] {
  return [
    [cropX,          cropY         ],  // TL
    [cropX + cropW,  cropY         ],  // TR
    [cropX,          cropY + cropH ],  // BL
    [cropX + cropW,  cropY + cropH ],  // BR
  ]
}

function _hitHandle(x: number, y: number): DragMode {
  const hit = 14
  const [[tlx, tly], [trx, try_], [blx, bly], [brx, bry]] = _handles()
  if (Math.abs(x - tlx) < hit && Math.abs(y - tly) < hit) return 'tl'
  if (Math.abs(x - trx) < hit && Math.abs(y - try_) < hit) return 'tr'
  if (Math.abs(x - blx) < hit && Math.abs(y - bly) < hit) return 'bl'
  if (Math.abs(x - brx) < hit && Math.abs(y - bry) < hit) return 'br'
  if (x > cropX && x < cropX + cropW && y > cropY && y < cropY + cropH) return 'move'
  return 'none'
}

function _toCanvasCoords(clientX: number, clientY: number): [number, number] {
  const canvas = cropCanvas.value!
  const rect   = canvas.getBoundingClientRect()
  return [
    (clientX - rect.left) * (canvas.width  / rect.width),
    (clientY - rect.top)  * (canvas.height / rect.height),
  ]
}

function onCropDown(clientX: number, clientY: number): void {
  const [x, y] = _toCanvasCoords(clientX, clientY)
  dragMode   = _hitHandle(x, y)
  dragStartX = x; dragStartY = y
  cropStartX = cropX; cropStartY = cropY
  cropStartW = cropW; cropStartH = cropH
}

function onCropMove(clientX: number, clientY: number): void {
  if (dragMode === 'none') return
  const [x, y] = _toCanvasCoords(clientX, clientY)
  const dx = x - dragStartX
  const dy = y - dragStartY
  const MIN = 20

  if (dragMode === 'move') {
    cropX = Math.max(0, Math.min(displayW - cropW, cropStartX + dx))
    cropY = Math.max(0, Math.min(displayH - cropH, cropStartY + dy))
  } else if (dragMode === 'tl') {
    const nx = Math.max(0,        Math.min(cropStartX + cropStartW - MIN, cropStartX + dx))
    const ny = Math.max(0,        Math.min(cropStartY + cropStartH - MIN, cropStartY + dy))
    cropW = cropStartW - (nx - cropStartX); cropH = cropStartH - (ny - cropStartY)
    cropX = nx; cropY = ny
  } else if (dragMode === 'tr') {
    const ny = Math.max(0,        Math.min(cropStartY + cropStartH - MIN, cropStartY + dy))
    cropW = Math.max(MIN, Math.min(displayW - cropStartX, cropStartW + dx))
    cropH = cropStartH - (ny - cropStartY); cropY = ny
  } else if (dragMode === 'bl') {
    const nx = Math.max(0,        Math.min(cropStartX + cropStartW - MIN, cropStartX + dx))
    cropW = cropStartW - (nx - cropStartX); cropX = nx
    cropH = Math.max(MIN, Math.min(displayH - cropStartY, cropStartH + dy))
  } else if (dragMode === 'br') {
    cropW = Math.max(MIN, Math.min(displayW - cropStartX, cropStartW + dx))
    cropH = Math.max(MIN, Math.min(displayH - cropStartY, cropStartH + dy))
  }

  drawCrop()
}

function onCropUp(): void {
  dragMode = 'none'
}

function confirmCrop(): void {
  if (!_onConfirm) return
  const rx = cropImg.naturalWidth  / displayW
  const ry = cropImg.naturalHeight / displayH
  const nx = Math.round(cropX * rx), ny = Math.round(cropY * ry)
  const nw = Math.round(cropW * rx), nh = Math.round(cropH * ry)

  const offscreen = document.createElement('canvas')
  offscreen.width  = nw
  offscreen.height = nh
  offscreen.getContext('2d')!.drawImage(cropImg, nx, ny, nw, nh, 0, 0, nw, nh)

  _onConfirm(offscreen.toDataURL('image/jpeg', 0.92))
  closeCrop()
}

export function useCrop() {
  return {
    cropOpen,
    cropSrc,
    cropCanvas,
    openCrop,
    closeCrop,
    initCropCanvas,
    onCropDown,
    onCropMove,
    onCropUp,
    confirmCrop,
  }
}
