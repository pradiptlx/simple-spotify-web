module.exports = {
  purge: ["./src/**/*.{js,tsx}", "./public/index.html"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      gridTemplateColumns: {
        sidebar: "minmax(0, 0.3fr) minmax(0, 1.7fr)",
      },
      backgroundColor: {
        primary: {
          light: "#737d8e",
          main: "#475161",
          dark: "#1f2937",
        },
        secondary: {
          light: "#d7ffd9",
          main: "#a5d6a7",
          dark: "#75a478",
        },
      },
      textColor: {
        secondary: {
          light: "#d7ffd9",
          main: "#a5d6a7",
          dark: "#75a478",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
