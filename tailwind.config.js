/** @type {import('tailwindcss').Config} */
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
    },
  },
  plugins: [],
}
