import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        clueso: {
          pink: "#e038b5",
          magenta: "#c026d3",
          purple: "#7c3aed",
          dark: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
