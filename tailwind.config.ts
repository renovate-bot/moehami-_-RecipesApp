import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        'bounce-horizontal': {
          '0%, 100%': { transform: 'translateX(0)' }, // Start and end at the original position
          '50%': { transform: 'translateX(3px)' },   // Move 10px to the right at 50% of the animation
        },
      },
      animation: {
        'bounce-horizontal': 'bounce-horizontal 1s ease-in-out infinite', // Define the animation duration and style
      },
    },
  },
  plugins: [],

  darkMode: 'class',
};
export default config;
