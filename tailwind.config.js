/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        primary: {
          DEFAULT: '#4a90e2',
          dark: '#3a7bc8',
          light: '#6ba5e9',
        },
        secondary: {
          DEFAULT: '#f5a623',
          dark: '#d48c15',
          light: '#f7b955',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'float1': 'float 6s ease-in-out infinite',
        'float2': 'float 8s ease-in-out infinite 1s',
        'float3': 'float 7s ease-in-out infinite 2s',
        'float4': 'float 10s ease-in-out infinite 0.5s',
        'float-slow': 'float 10s ease-in-out infinite',
        'float-medium': 'float 7s ease-in-out infinite 1s',
        'float-fast': 'float 5s ease-in-out infinite 0.5s',
        'slowPan': 'slowPan 30s linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-slow': 'bounce 3s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
        'reverse-spin-slow': 'reverse-spin 8s linear infinite',
        'wave': 'wave 10s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slowPan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5%)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'reverse-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        '.animation-delay-600': {
          'animation-delay': '600ms',
        },
        '.animation-delay-900': {
          'animation-delay': '900ms',
        },
        '.animation-delay-1200': {
          'animation-delay': '1200ms',
        },
        '.animation-delay-1500': {
          'animation-delay': '1500ms',
        },
        '.animation-delay-1800': {
          'animation-delay': '1800ms',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
}
