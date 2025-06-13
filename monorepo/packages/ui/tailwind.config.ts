// packages/ui/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    '../../apps/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        fontFamily: {
          sans: ["var(--font-sans)", "system-ui", "sans-serif"],
          mono: ["var(--font-mono)", "monospace"],
          roboto: ["var(--font-roboto)", "Roboto", "sans-serif"],
          holtwood: ['var(--font-holtwood)'],
        },
        // ... rest of your theme configuration
      },
  },
  plugins: [],
}
export default config;