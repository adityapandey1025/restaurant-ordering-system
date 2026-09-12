import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17231b",
        cream: "#f7f2e8",
        saffron: "#e68a2e",
        leaf: "#2d6045",
      },
      boxShadow: {
        card: "0 18px 50px -30px rgba(23, 35, 27, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
