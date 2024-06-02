import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      'text': '#2b2b2b',
      'background': '#e4e2dd',
      'primary': '#36c9ae',
      'secondary': '#8ae891',
      'accent': '#61dfbe',
     },
     fontFamily: {
      anton: ['anton', 'sans-serif'],
      poppins : ["Eudoxus Sans",  'sans-serif'],
    },
  },
  plugins: [],
};
export default config;
