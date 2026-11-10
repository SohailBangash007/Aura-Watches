/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08080a',
        'ink-2': '#0c0c0f',
        'ink-3': '#111116',
        surface: '#14141a',
        gold: {
          DEFAULT: '#c9a961',
          soft: '#b8985a',
          bright: '#e8d5a3'
        },
        cream: '#f4f0e8',
        muted: '#9b988f',
        'muted-2': '#6f6c66'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'Inter', 'system-ui', 'sans-serif']
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        halo: {
          '0%,100%': { opacity: '.75', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' }
        },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        marquee: { to: { transform: 'translateX(-50%)' } },
        riseUp: { to: { transform: 'translateY(0)' } },
        pageIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        toastIn: { from: { opacity: '0', transform: 'translateY(18px)' }, to: { opacity: '1', transform: 'none' } },
        pingSoft: {
          '0%': { boxShadow: '0 0 0 0 rgba(201,169,97,.4)' },
          '70%': { boxShadow: '0 0 0 22px rgba(201,169,97,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(201,169,97,0)' }
        },
        popIn: { from: { opacity: '0', transform: 'scale(.94)' }, to: { opacity: '1', transform: 'none' } }
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        halo: 'halo 7s ease-in-out infinite',
        'spin-slow': 'spinSlow 90s linear infinite',
        marquee: 'marquee 38s linear infinite',
        'page-in': 'pageIn .7s cubic-bezier(.16,1,.3,1) both',
        'toast-in': 'toastIn .45s cubic-bezier(.16,1,.3,1) both',
        'ping-soft': 'pingSoft 2.8s ease-out infinite',
        'pop-in': 'popIn .6s cubic-bezier(.16,1,.3,1) both'
      }
    }
  },
  plugins: []
};
