import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: "#00a884",
        secondary: "#222e35",
        dark: "#212328",
        danger: "#eb3330",
        success: "#4aac68",
        bgPrimary: "#111b21",
        borderColor: "#333f46",
        bgInput: "#2a3942",
        bgMyMessage: "#005c4b",
        byIncomingMessage: "#202c33",
      },
    },
  },
  plugins: [],
}
export default config
