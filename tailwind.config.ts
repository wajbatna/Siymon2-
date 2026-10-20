import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7650E8',
          'purple-dark': '#5B3AC4',
          'purple-light': '#A78BFA',
          deep: '#292345',
          navy: '#211D3B',
          surface: '#2F2950',
          yellow: '#FFD889',
          cream: '#FFF9ED',
          ink: '#24213A',
          muted: '#777389',
        },
        success: { DEFAULT: '#28A745', soft: '#E6F6EC' },
        danger: { DEFAULT: '#DC3545', soft: '#FCEAEC' },
        warning: { DEFAULT: '#F5A623', soft: '#FEF3E0' },
        info: { DEFAULT: '#3B82F6', soft: '#EAF2FE' },
      },
      fontFamily: {
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(33, 29, 59, 0.08)',
        card: '0 12px 32px rgba(33, 29, 59, 0.10)',
        lift: '0 18px 45px rgba(33, 29, 59, 0.16)',
        glow: '0 10px 30px rgba(118, 80, 232, 0.35)',
        innerlight: 'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #8F6BFF 0%, #7650E8 55%, #5B3AC4 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(33,29,59,0) 0%, rgba(33,29,59,0.75) 100%)',
        'cream-gradient': 'linear-gradient(180deg, #FFF9ED 0%, #FFFFFF 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.45s ease both',
        'fade-in': 'fade-in 0.3s ease both',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.2s ease both',
        shimmer: 'shimmer 1.4s linear infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
