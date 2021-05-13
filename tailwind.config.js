const {spacing } = require('tailwindcss/defaultTheme')

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.js',
    './src/**/*.jsx',
    './src/**/*.tsx',
    './src/**/*.ts',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "flame-pea": "#E06B3E",// "#38383f", // "#df5828", 
        "wild-sand": "#f6f6f6",
        "mercury":"#eae9e8",
        "ship-gray": "#37363a",
        "tuna": "#38383f",
        "silver-chalice": "#b1b1b1",
        "storm-gray": "#6c6c85",
        "congress-blue": "#02538f",
        "mountain-meadow": "#1bc59d",
        "cream-can":"#f2c85e",
        "tamarillo": "#930e1d",
        "trendy-green": "#6b911b"
      },
      fontFamily: {
        'display': ['Dosis', 'sans-serif',],
        'body': ['Open Sans',]
      },
      minWidth: {
        ...spacing
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        'auto-fit': 'repeat(auto-filt, minmax(350px, auto))',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
