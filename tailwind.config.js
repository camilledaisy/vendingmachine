/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F5EEDF',
        sage: '#A3B18A',
        rose: '#D4A5A5',
        butter: '#F2D98D',
        burgundy: '#914F4F',
        charcoal: '#403B36',
      },
      fontFamily: {
        display: ['"Pixelify Sans"', 'ui-monospace', 'monospace'],
        lcd: ['VT323', 'ui-monospace', 'monospace'],
        hand: ['Caveat', 'cursive'],
        tagline: ['"Gloria Hallelujah"', 'Caveat', 'cursive'],
        scrawl: ['"Reenie Beanie"', 'Caveat', 'cursive'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
