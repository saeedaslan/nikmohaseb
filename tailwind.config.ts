import { type Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["IRANSansWeb", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
