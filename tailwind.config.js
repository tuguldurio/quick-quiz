const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        emerald: colors.emerald,
      },
      fontFamily: {
        'KoHo': ['KoHo', 'sans-serif'],
      }
    },
    container: {
      screens: {
         sm: "640px",
         md: "768px",
        //  lg: "1024px",
        //  xl: "1280px"
      }
    }
  },
  variants: {
    extend: {
      opacity: ['disabled']
    },
  },
  plugins: [],
}
