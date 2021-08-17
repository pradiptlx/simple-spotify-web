module.exports = {
  purge: ["./src/**/*.{js,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        'sidebar': 'minmax(0, 0.2fr) minmax(0,1.8fr)'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
