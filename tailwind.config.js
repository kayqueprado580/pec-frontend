// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // ou 'media' ou 'class'
  theme: {
    extend: {
      colors: {
        'default-green': '#1A5D1A',
        'default-green-2': '#409c57',
        'light-default-green': '#86bd94',
        'default-yellow': '#FBD85D',
        'default-yellow-2': '#FFD95A',
        'bg-yellow': '#FFF7D4',
        'bg-yellow-light': '#fcf7df',
        'default-black': '#060606',
        'default-gray-light': '#5e5e5e',
        'default-gray': '#545454',
        'default-red': '#F71212'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};