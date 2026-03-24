/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        app:      '#0f0e0c',
        surface:  '#191714',
        surface2: '#211f1b',
        surface3: '#2a2824',
        line:     '#2c2a26',
        line2:    '#383532',
        accent:   '#f5c842',
        'accent-dim': 'rgba(245,200,66,0.11)',
        danger:   '#ff4545',
        fore:     '#f0ede6',
        muted:    '#8a8680',
        faint:    '#4a4845',
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
