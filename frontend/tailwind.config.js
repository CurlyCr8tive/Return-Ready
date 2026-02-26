/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy:        '#1B2A4A',
        navylight:   '#243558',
        navyhover:   '#2A4A7F',
        border:      '#2E4270',
        gold:        '#C9A84C',
        teal:        '#3DBFB8',
        textprimary: '#F0F4FF',
        textmuted:   '#8A9DC0',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
