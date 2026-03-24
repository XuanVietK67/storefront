/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        app:      '#f6f6f1',
        surface:  '#ffffff',
        surface2: '#f1f1f1',
        surface3: '#e8e8e1',
        line:     '#d9d9d9',
        line2:    '#c4c4c4',
        accent:   '#008060',
        'accent-dim': 'rgba(0,128,96,0.10)',
        danger:   '#d72c0d',
        fore:     '#1a1a1a',
        muted:    '#6d6d6d',
        faint:    '#a8a8a8',
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
