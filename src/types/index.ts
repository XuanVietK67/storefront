export interface CanvasElement {
  id: string
  type: 'text' | 'sticker' | 'icon' | 'image'
  content: string
  color: string
  fontFamily: string
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
  bold?: boolean
  shadow?: boolean
  fontSize?: number       // logical px, default 20
  letterSpacing?: number  // px, default 0
  textDecoration?: string // '' | 'underline' | 'line-through'
  textEffect?: string     // '' | 'outline' | 'curved' | 'wave' | '3d' | 'longshadow'
  // image-only fields
  flipX?:      boolean
  flipY?:      boolean
  brightness?: number  // 0–200, default 100
  contrast?:   number  // 0–200, default 100
  saturate?:   number  // 0–200, default 100
  sepia?:      number  // 0–100, default 0
}

export interface SavedDesign {
  version: '1'
  savedAt: string          // ISO timestamp
  elements: CanvasElement[]
}

export interface CartOrder {
  orderId:  string
  product:  string
  price:    string
  savedAt:  string          // ISO timestamp
  design: {
    elements:     CanvasElement[]
    textLabels:   string[]  // content of every text element
    elementCount: number
  }
}

export interface UploadSource {
  icon: string
  label: string
  toast: string
  sub?: string
}

export interface SidebarTool {
  key: string
  icon: string
  label: string
  divider?: never
}

export interface SidebarDivider {
  divider: true
  key?: never
  icon?: never
  label?: never
}

export type SidebarItem = SidebarTool | SidebarDivider
