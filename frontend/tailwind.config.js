/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "rainbow-slow": "rainbow 8s linear infinite",
      },
      keyframes: {
        rainbow: {
          "0%, 100%": { "border-color": "#ff0000" },
          "20%": { "border-color": "#ffff00" },
          "40%": { "border-color": "#00ff00" },
          "60%": { "border-color": "#00ffff" },
          "80%": { "border-color": "#0000ff" },
        },
      },
    },
  },
  plugins: [],
};
