// tailwind.config.cjs
import defaultTheme from "tailwindcss/defaultTheme";
import starlightPlugin from "@astrojs/starlight-tailwind";

// Generated color palettes
const accent = {
  200: "#c3c2f8",
  600: "#6747e4",
  900: "#2f2568",
  950: "#211d46",
};

const gray = {
  100: "#f6f6f6",
  200: "#eeeeee",
  300: "#c2c2c2",
  400: "#8b8b8b",
  500: "#585858",
  700: "#383838",
  800: "#272727",
  900: "#181818",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        accent,
        gray,
        accent1: {
          DEFAULT: "rgb(var(--color-accent1) / <alpha-value>)",
          hover: "rgb(var(--color-accent1-hover) / <alpha-value>)",
        },
        accent2: "rgb(var(--color-accent2) / <alpha-value>)",
        accent3: "rgb(var(--color-accent3) / <alpha-value>)",
        accent4: "rgb(var(--color-accent4) / <alpha-value>)",
      },
      fontFamily: {
        // Your preferred text font. Starlight uses a system font stack by default.
        sans: ['"Open Sans"', "sans-serif", ...defaultTheme.fontFamily.sans],
        // Your preferred code font. Starlight uses system monospace fonts by default.
        mono: ['"IBM Plex Mono"'],
      },
    },
  },
  plugins: [starlightPlugin()],
};
