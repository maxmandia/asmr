import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#161617",
        primary: "#9C4CD0",
        primary_hover: "#B777E1",
        card_hover: "#262626",
        text: "white",
        input: "#272727",
        input_hover: "#2F2F2F",
        grey: "#808080",
      },
      screens: {
        md: "540px",
      },
    },
  },
  plugins: [],
} satisfies Config;
