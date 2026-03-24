/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        app:      '#f5f7ff',
        surface:  '#ffffff',
        surface2: '#ffffff',
        surface3: '#f1f5f9',
        line:     '#e2e8f0',
        line2:    '#cbd5e1',
        accent:   '#008060',
        'accent-dim': 'rgba(0,128,96,0.10)',
        danger:   '#d72c0d',
        fore:     '#0f172a',
        muted:    '#64748b',
        faint:    '#94a3b8',
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm:   ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        card: '13px',
        sm:   '9px',
      },
      keyframes: {
        'pop-in': {
          from: { transform: 'scale(0.3) rotate(-10deg)', opacity: '0' },
          to:   { transform: 'scale(1) rotate(0deg)',     opacity: '1' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      },
    },
  },
  plugins: [],
}
