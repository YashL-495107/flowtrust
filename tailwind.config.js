/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          serif: ['"Source Serif 4"', 'ui-serif', 'Georgia', 'serif'],
          mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
          ink: '#1a1a1a',
          paper: '#f9f8f6',
          canvas: '#f3f1ed',
          line: '#e4e1db',
          muted: '#6e6b64',
          skeleton: '#eeece8',
          teal: {
              DEFAULT: '#2d4f4f',
              soft: '#eaf1f1',
              deep: '#1e3636',
          },
          sage: '#62826c',
          rust: '#b85c5c',
      }
    },
  },
  plugins: [],
}
