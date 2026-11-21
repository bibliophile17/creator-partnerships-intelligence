import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0b1b33",
          800: "#13264a",
          700: "#26364f",
          600: "#3d4b63",
          500: "#5b6a82",
          400: "#8591a5",
          300: "#b4bdcb",
          200: "#d9dee7",
          100: "#eceff4",
          50: "#f6f8fb",
        },
        brand: {
          700: "#1d4ed8",
          600: "#2563eb",
          500: "#3b82f6",
          100: "#dbe7ff",
          50: "#eff5ff",
        },
      },
      fontFamily: {
        sans: [
          "Segoe UI",
          "Inter",
          "system-ui",
          "-apple-system",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,27,51,0.05), 0 1px 3px rgba(11,27,51,0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
