/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        app:      '#f7f6f3',
        surface:  '#ffffff',
        surface2: '#f3f1ec',
        surface3: '#ece9e3',
        line:     '#e8e5df',
        line2:    '#d8d5cf',
        accent:   '#f5c842',
        'accent-dim': 'rgba(245,200,66,0.14)',
        danger:   '#ef4444',
        fore:     '#1a1916',
        muted:    '#706d69',
        faint:    '#a09d99',
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
