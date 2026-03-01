export default {
  corePlugins: {
    preflight: true, // Disable Tailwind's base reset
  },
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
