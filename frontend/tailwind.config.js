/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme (staff portal)
        navy:      '#1B2A4A',
        blue:      '#2E5FA3',
        midblue:   '#4A7FC1',
        lightblue: '#D6E4F7',
        accent:    '#00A86B',
        orange:    '#E07B39',
        lightgray: '#F4F6F9',
        medgray:   '#E2E6ED',
        gray:      '#5A6475',
        // Dark theme (Joanna's dashboard)
        darkbg:      '#13202f',
        darkcard:    '#1c2e42',
        darksidebar: '#0d1a28',
        darkhover:   '#1e3250',
        darkborder:  '#253d58',
        teal:        '#3dd4a6',
        tealdim:     '#2ab38c',
        gold:        '#f5c03a',
        golddark:    '#d4a02e',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card:     '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        md:       '0 4px 12px 0 rgba(0,0,0,0.08)',
        'dark-md':'0 4px 20px 0 rgba(0,0,0,0.3)',
      },
      borderRadius: {
        xl:  '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
