module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F4A300",
        brown: "#3B2F2F",
        muted: "#7A6F66",
        cream: "#FFF8F0",
        maroon: "#6B2C35",
      },
      fontFamily: {
        brand: ["'Playfair Display'", "serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
