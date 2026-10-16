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
        balance: {
          canvas: "#f7f8f2",
          surface: "#ffffff",
          soft: "#f1f4ec",
          border: "#dce3d5",
          ink: "#193c32",
          muted: "#627169",
          primary: "#193c32",
          hover: "#2b5345",
          accent: "#d9e9bc",
          "nav-text": "#e5edda",
          "nav-muted": "#b7c8ac",
          income: "#567535",
          "income-soft": "#edf3e4",
          expense: "#8b6241",
          "expense-soft": "#f5ece2",
          error: "#a13f35",
        },
      },
      keyframes: {
        "balance-line": {
          "0%": { strokeDasharray: "1", strokeDashoffset: "1", opacity: "0" },
          "12%": { opacity: "1" },
          "65%, 100%": { strokeDasharray: "1", strokeDashoffset: "0", opacity: "1" },
        },
      },
      animation: {
        "balance-line": "balance-line 4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
      fontFamily: {
        title: ['"Pacifico"', 'cursive']
      }
    },
  },
  plugins: [],
};
