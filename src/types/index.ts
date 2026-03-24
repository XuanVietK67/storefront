export interface CanvasElement {
  id: string
  type: 'text' | 'sticker' | 'icon'
  content: string
  color: string
  fontFamily: string
  x: number
  y: number
  scale: number
  rotation: number
  opacity: number
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
