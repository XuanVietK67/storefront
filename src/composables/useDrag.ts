import { CANVAS_SIZE } from '@/constants'

type MoveCallback   = (x: number, y: number) => void
type ResizeCallback = (scale: number) => void

export function makeDragHandlers(
  onMove:      MoveCallback,
  onSelect:    () => void,
  getCanvasEl: () => HTMLElement | null,
) {
  let startMouseX = 0, startMouseY = 0, startElX = 0, startElY = 0

  function getScale(): number {
    const el = getCanvasEl()
    if (!el) return 1
    return el.getBoundingClientRect().width / CANVAS_SIZE.w
  }

  function onPointerMove(e: MouseEvent | TouchEvent): void {
    e.preventDefault()
    const t = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent)
    const sc = getScale()
    const x = Math.max(0, Math.min(CANVAS_SIZE.w - 30, startElX + (t.clientX - startMouseX) / sc))
    const y = Math.max(0, Math.min(CANVAS_SIZE.h - 24, startElY + (t.clientY - startMouseY) / sc))
    onMove(x, y)
  }

  function onPointerUp(): void {
    document.removeEventListener('mousemove', onPointerMove)
    document.removeEventListener('mouseup',   onPointerUp)
    document.removeEventListener('touchmove', onPointerMove)
    document.removeEventListener('touchend',  onPointerUp)
  }

  /** Call with the event AND the element's current x/y so the drag offset is correct. */
  function onPointerDown(e: MouseEvent | TouchEvent, elX: number, elY: number): void {
    e.preventDefault()
    onSelect()
    const t = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent)
    startMouseX = t.clientX
    startMouseY = t.clientY
    startElX    = elX
    startElY    = elY
    document.addEventListener('mousemove', onPointerMove)
    document.addEventListener('mouseup',   onPointerUp)
    document.addEventListener('touchmove', onPointerMove, { passive: false })
    document.addEventListener('touchend',  onPointerUp)
  }

  return { onPointerDown }
}

export function makeResizeHandlers(
  onResize:        ResizeCallback,
  getCurrentScale: () => number,
) {
  let startMouseX = 0, startMouseY = 0, startScale = 1

  function onPointerMove(e: MouseEvent | TouchEvent): void {
    e.preventDefault()
    const t  = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent)
    const ns = Math.max(0.25, Math.min(4, startScale + ((t.clientX - startMouseX) + (t.clientY - startMouseY)) / 110))
    onResize(ns)
  }

  function onPointerUp(): void {
    document.removeEventListener('mousemove', onPointerMove)
    document.removeEventListener('mouseup',   onPointerUp)
    document.removeEventListener('touchmove', onPointerMove)
    document.removeEventListener('touchend',  onPointerUp)
  }

  function onPointerDown(e: MouseEvent | TouchEvent): void {
    e.preventDefault()
    e.stopPropagation()
    const t = (e as TouchEvent).touches?.[0] ?? (e as MouseEvent)
    startMouseX = t.clientX
    startMouseY = t.clientY
    startScale  = getCurrentScale()
    document.addEventListener('mousemove', onPointerMove)
    document.addEventListener('mouseup',   onPointerUp)
    document.addEventListener('touchmove', onPointerMove, { passive: false })
    document.addEventListener('touchend',  onPointerUp)
  }

  return { onPointerDown }
}
