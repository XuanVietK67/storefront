import type { CanvasElement } from '@/types'

const PAD = 14

// ── Helpers ───────────────────────────────────────────────────────────────────

function fontStr(el: CanvasElement): string {
  const weight = el.bold !== false ? 'bold' : 'normal'
  const size   = el.fontSize ?? 20
  const family = el.fontFamily || 'sans-serif'
  return `${weight} ${size}px ${family}`
}

function applyShadow(ctx: CanvasRenderingContext2D): void {
  ctx.shadowColor   = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur    = 6
  ctx.shadowOffsetX = 2
  ctx.shadowOffsetY = 3
}

/** Width of each character individually (respects measured glyph widths). */
function getCharWidths(ctx: CanvasRenderingContext2D, text: string): number[] {
  return [...text].map(ch => ctx.measureText(ch).width)
}

/** Sum of glyph widths + inter-character spacing. */
function totalTextWidth(widths: number[], spacing: number): number {
  return widths.reduce((s, w) => s + w, 0) + spacing * Math.max(0, widths.length - 1)
}

/** Draw text char-by-char so letterSpacing is honoured on the offscreen canvas. */
function drawSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  widths: number[],
  spacing: number,
  startX: number,
  y: number,
): void {
  let x = startX
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], x, y)
    x += widths[i] + spacing
  }
}

/** Darken a hex colour by factor t (0 = original, 1 = black). */
function darken(hex: string, t: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  const h = hex.replace('#', '')
  let r = 0, g = 0, b = 0
  if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16)
    g = parseInt(h.slice(2, 4), 16)
    b = parseInt(h.slice(4, 6), 16)
  } else if (h.length === 3) {
    r = parseInt(h[0] + h[0], 16)
    g = parseInt(h[1] + h[1], 16)
    b = parseInt(h[2] + h[2], 16)
  }
  return `rgb(${clamp(r*(1-t))},${clamp(g*(1-t))},${clamp(b*(1-t))})`
}

// ── Curved ────────────────────────────────────────────────────────────────────

/**
 * Places each character along the top arc of a circle.
 * Circle centre sits at the bottom of the canvas; text radiates upward.
 */
function renderCurved(el: CanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')!
  const text    = el.content
  const fontSize = el.fontSize ?? 20
  const spacing  = el.letterSpacing ?? 0
  const color    = el.color || '#000000'

  ctx.font = fontStr(el)
  const cws = getCharWidths(ctx, text)
  const tw  = totalTextWidth(cws, spacing)

  // Radius so the whole text spans ≈ 65% of a half-circle
  const radius = Math.max(tw / (Math.PI * 0.65), fontSize * 2.2)

  canvas.width  = Math.ceil(2 * (radius + fontSize * 0.9 + PAD))
  canvas.height = Math.ceil(radius + fontSize * 1.6 + PAD)

  ctx.font         = fontStr(el)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle    = color
  if (el.shadow) applyShadow(ctx)

  const cx = canvas.width / 2
  const cy = canvas.height  // circle centre at canvas bottom edge

  const totalAngle = tw / radius
  let   angle      = -totalAngle / 2

  for (let i = 0; i < text.length; i++) {
    const w    = cws[i]
    const half = w / radius / 2
    angle += half                                       // advance to char centre

    const ax = cx + radius * Math.sin(angle)
    const ay = cy - radius * Math.cos(angle)

    ctx.save()
    ctx.translate(ax, ay)
    ctx.rotate(angle)
    ctx.fillText(text[i], -w / 2, 0)
    ctx.restore()

    angle += half + spacing / radius                   // advance past this char
  }

  return canvas
}

// ── Wave ──────────────────────────────────────────────────────────────────────

/**
 * Each character oscillates vertically along a sine wave.
 */
function renderWave(el: CanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')!
  const text    = el.content
  const fontSize = el.fontSize ?? 20
  const spacing  = el.letterSpacing ?? 0
  const color    = el.color || '#000000'

  ctx.font = fontStr(el)
  const cws = getCharWidths(ctx, text)
  const tw  = totalTextWidth(cws, spacing)

  const amp  = fontSize * 0.35
  const freq = 1.1   // radians per character step

  canvas.width  = Math.ceil(tw + PAD * 2)
  canvas.height = Math.ceil(fontSize * 1.5 + amp * 2 + PAD * 2)

  ctx.font         = fontStr(el)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle    = color
  if (el.shadow) applyShadow(ctx)

  const baselineY = amp + fontSize + PAD
  let x = PAD

  for (let i = 0; i < text.length; i++) {
    const y = baselineY + amp * Math.sin(i * freq)
    ctx.fillText(text[i], x, y)
    x += cws[i] + spacing
  }

  return canvas
}

// ── 3D / Extrude ──────────────────────────────────────────────────────────────

/**
 * Draws darkened copies of the text with increasing diagonal offset to fake
 * depth, then draws the original colour on top.
 */
function render3D(el: CanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')!
  const text    = el.content
  const fontSize = el.fontSize ?? 20
  const spacing  = el.letterSpacing ?? 0
  const color    = el.color || '#000000'

  ctx.font = fontStr(el)
  const cws = getCharWidths(ctx, text)
  const tw  = totalTextWidth(cws, spacing)

  const depth = Math.max(3, Math.round(fontSize * 0.2))
  const ox    = depth * 0.75
  const oy    = depth * 0.75

  canvas.width  = Math.ceil(tw + ox + PAD * 2)
  canvas.height = Math.ceil(fontSize * 1.35 + oy + PAD * 2)

  ctx.font         = fontStr(el)
  ctx.textBaseline = 'alphabetic'

  const baselineY = fontSize + PAD

  const drawLayer = (xOff: number, yOff: number, fill: string) => {
    ctx.fillStyle = fill
    drawSpaced(ctx, text, cws, spacing, PAD + xOff, baselineY + yOff)
  }

  // Back → front depth layers
  for (let i = depth; i >= 1; i--) {
    const t = 0.5 + (i / depth) * 0.35
    drawLayer(i * ox / depth, i * oy / depth, darken(color, t))
  }

  // Top surface
  if (el.shadow) applyShadow(ctx)
  drawLayer(0, 0, color)

  return canvas
}

// ── Long Shadow ───────────────────────────────────────────────────────────────

/**
 * Draws many near-transparent copies of the text extending diagonally
 * (bottom-right), then draws the solid text on top.
 */
function renderLongShadow(el: CanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const ctx    = canvas.getContext('2d')!
  const text    = el.content
  const fontSize = el.fontSize ?? 20
  const spacing  = el.letterSpacing ?? 0
  const color    = el.color || '#000000'

  ctx.font = fontStr(el)
  const cws = getCharWidths(ctx, text)
  const tw  = totalTextWidth(cws, spacing)

  const shadowLen = Math.ceil(fontSize * 1.5)

  canvas.width  = Math.ceil(tw + shadowLen + PAD * 2)
  canvas.height = Math.ceil(fontSize * 1.35 + shadowLen + PAD * 2)

  ctx.font         = fontStr(el)
  ctx.textBaseline = 'alphabetic'

  const baselineY = fontSize + PAD

  // Shadow steps (back to front)
  for (let i = shadowLen; i >= 1; i--) {
    ctx.fillStyle = `rgba(0,0,0,0.022)`
    drawSpaced(ctx, text, cws, spacing, PAD + i, baselineY + i)
  }

  // Main text
  ctx.fillStyle = color
  drawSpaced(ctx, text, cws, spacing, PAD, baselineY)

  return canvas
}

// ── Entry point ───────────────────────────────────────────────────────────────

export function buildTextEffectCanvas(el: CanvasElement): HTMLCanvasElement | null {
  if (!el.textEffect || el.textEffect === '' || el.textEffect === 'outline') return null
  switch (el.textEffect) {
    case 'curved':     return renderCurved(el)
    case 'wave':       return renderWave(el)
    case '3d':         return render3D(el)
    case 'longshadow': return renderLongShadow(el)
    default:           return null
  }
}
