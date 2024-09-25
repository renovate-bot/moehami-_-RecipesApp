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
        custom_orange: '#f26b5a',
        custom_orange_var: {
          50: '#fdecea',  // lightest
          100: '#fcd7d1',
          200: '#f9b0a5',
          300: '#f68979',
          400: '#f36c5b',
          500: '#f26b5a',  // base
          600: '#e96252',
          700: '#d55748',
          800: '#c04b3d',
          900: '#a63d32',  // darkest
        },
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
