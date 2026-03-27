export const STICKERS: string[] = [
  '🌸','🌈','⚡','🔥','💫','🌙','🦋','🌿','🍀','💎',
  '🦄','🎨','🍒','🌺','💥','🎯','🌊','✌️','🦊','🏆',
  '🐉','🌵','🍄','🔮','🐬','🎪','🫧','🪩',
]

export const ICONS: string[] = [
  '♠','♥','♦','♣','★','☀','☽','⚡','⊕','◈',
  '◆','▲','●','❋','⟁','⌘','✦','◉','⬡','⌬',
  '⊛','⋄','✿','⬟','❂','⊹','✺','⊼',
]

export const FONT_CATEGORIES: { label: string; fonts: string[] }[] = [
  {
    label: 'Sans Serif',
    fonts: [
      'DM Sans', 'Roboto', 'Open Sans', 'Lato', 'Poppins',
      'Inter', 'Nunito', 'Work Sans', 'Quicksand', 'Cabin',
      'Mulish', 'Montserrat', 'Raleway',
    ],
  },
  {
    label: 'Serif',
    fonts: [
      'Playfair Display', 'Merriweather', 'Lora',
      'EB Garamond', 'Cormorant Garamond', 'Libre Baskerville', 'Georgia',
    ],
  },
  {
    label: 'Display',
    fonts: [
      'Syne', 'Bebas Neue', 'Anton', 'Oswald',
      'Abril Fatface', 'Righteous', 'Fredoka', 'Titan One', 'Impact',
    ],
  },
  {
    label: 'Script & Handwriting',
    fonts: [
      'Lobster', 'Pacifico', 'Dancing Script', 'Sacramento',
      'Great Vibes', 'Satisfy', 'Caveat', 'Permanent Marker',
      'Indie Flower', 'Amatic SC',
    ],
  },
  {
    label: 'Monospace',
    fonts: ['Courier New', 'Source Code Pro', 'Space Mono'],
  },
]

// Flat list derived from categories — used for canvas rendering and backwards compat
export const FONTS: string[] = FONT_CATEGORIES.flatMap(c => c.fonts)

export const COLORS: string[] = [
  '#1a1a1a','#ffffff','#f5c842','#ff6b35',
  '#4ecdc4','#ff6b9d','#a8d8a8','#95a5d0',
  '#e74c3c','#2ecc71','#9b59b6','#e67e22',
]

export const PRESETS: string[] = ['🌈','⚡','🔥','💫','🦋','🌿','💎','🎨','🦄','🐉','🌸','🍄']

export const TOOL_NAMES: Record<string, string> = {
  text:    'Add Text',
  image:   'Add Image',
  sticker: 'Stickers',
  icon:    'Icons',
  adjust:  'Adjust Selected',
  layers:  'Layer Stack',
}

export const CANVAS_SIZE = { w: 280, h: 320 } as const

/** Printable zone — matches the bag body rect in BagSvg (x=16, y=52, w=248, h=256).
 *  All canvas elements are constrained to this area. */
export const PRINT_ZONE = { x: 16, y: 52, w: 248, h: 256 } as const
