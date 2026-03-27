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
