import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gray:{
          DEFAULT: '#4F4C4C',
          100: '#3B3A3A',
          200: '#F7F8FC',
          700: '#E6E7E9'
        },
        gold:{
          DEFAULT:'#A48B01',
          100:'#EDCD1F'
        }
      },
      fontSize: {
        'header-sm': '1.25rem', // Small headers
        'header-md': '1.875rem', // Medium headers
        'header-lg': '2.25rem', // Large headers
        'header-xl': '3rem', // Extra large headers
        'header-2xl': '4rem', // 2X large headers
      },
    },
  },
  plugins: [],
} satisfies Config;
