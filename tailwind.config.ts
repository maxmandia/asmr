import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#161617",
        text: "white",
      },
    },
  },
  plugins: [],
} satisfies Config;
