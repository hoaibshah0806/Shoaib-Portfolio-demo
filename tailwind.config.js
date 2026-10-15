/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#030305',
          900: '#07070a',
          800: '#0a0a0f',
          700: '#12121c',
          600: '#1a1a2b',
        },
        system: {
          cyan: '#00E5FF',
          blue: '#0099FF',
          glow: 'rgba(0, 229, 255, 0.65)',
        },
        shadow: {
          monarch: '#6B21A8',
          violet: '#9333EA',
          dark: '#3B0764',
          void: '#180B2B',
        },
        rank: {
          s: '#00E5FF',
          a: '#A855F7',
          b: '#3B82F6',
          c: '#10B981',
          danger: '#EF4444',
          gold: '#F59E0B',
        }
      },
      fontFamily: {
        system: ['"JetBrains Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'system-glow': '0 0 25px rgba(0, 229, 255, 0.35)',
        'system-glow-lg': '0 0 45px rgba(0, 229, 255, 0.55)',
        'monarch-glow': '0 0 35px rgba(107, 33, 168, 0.45)',
        'monarch-glow-lg': '0 0 60px rgba(147, 51, 234, 0.55)',
        'dual-aura': '0 0 30px rgba(0, 229, 255, 0.25), 0 0 50px rgba(107, 33, 168, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'aura-pulse': 'auraPulse 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        auraPulse: {
          '0%': { opacity: '0.4', filter: 'blur(20px)' },
          '100%': { opacity: '0.8', filter: 'blur(35px)' },
        }
      }
    },
  },
  plugins: [],
}
