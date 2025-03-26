import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray:{
          DEFAULT: '#4F4C4C',
          10:'#e3e3e8',
          100: '#3B3A3A',
          200: '#F7F8FC',
          300: '#bebfc2',
          600: '#5E5C5C',
          700: '#E6E7E9',
        },
        gold:{
          DEFAULT:'#A48B01',
          100:'#EDCD1F',
          200:'#FFD700',
          300:'#C2A60C'
        }
      },
      backgroundImage: {
        'button-gradient-metallic': 
          'linear-gradient(135deg, #BA9A61, #967238, #BA9A61, #967238)', 
        'background-gradient': 
          'linear-gradient(135deg, #4F4C4C, #A48B01)', 
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
