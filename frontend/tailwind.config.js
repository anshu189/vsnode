/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "primary": "var(--primary)",
        "primary2": "var(--primary2)",
        "primary3": "var(--primary3)",
        "primary4": "var(--primary4)",
        "bg-dark": "var(--bg-dark)",
        "bg": "var(--bg)",
        "bg-light": "var(--bg-light)",
        "t-dark": "var(--t-dark)",
        "t": "var(--t)",
        "t-light": "var(--t-light)",
      },
      boxShadow: {
        "sh-s": "var(--sh-s)",
        "sh-m": "var(--sh-m)",
        "sh-l": "var(--sh-l)",
      },
    },
  },
  plugins: [],
}