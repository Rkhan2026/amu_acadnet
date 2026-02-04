/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        academic: {
          50: "#fafafa",
          100: "#f4f4f5",
          800: "#27272a",
          900: "#18181b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Cal Sans", "Inter", "sans-serif"],
      },
      spacing: {
        section: "5rem",
      },
      maxWidth: {
        container: "1200px",
      },
    },
  },
  plugins: [],
};
