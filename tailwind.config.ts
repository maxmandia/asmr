import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#161617",
        primary: "#9C4CD0",
        text: "white",
        input: "#272727",
      },
    },
  },
  plugins: [],
} satisfies Config;
