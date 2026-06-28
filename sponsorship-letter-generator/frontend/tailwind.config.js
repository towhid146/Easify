/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#0e7490",
        accent: "#f59e0b"
      }
    }
  },
  plugins: []
};
