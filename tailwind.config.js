/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'sm-custom': { 'max': '767px' },
        'lg-custom': { 'max': '1021px' },
      },
      zIndex: {
        'custom-index': '9999',
      },
      fontSize: {
        'custom-font': '50px',
      },
      fontWeight: {
        'ClashCustom': '400'
      },
      lineHeight: {
        'custom-height': 'normal'
      },
      colors: {
        link: {
          hover: "#F6D200"
        },
        button: {
          background: {
            primary: "#202A54",
            secondary: "#F6D200"
          },
        },
      },
      fontFamily: {
        // "ClashExtraLight": ["Clash-Extralight"],
        // "ClashLight": ["Clash-Light"],
        // "ClashMedium": ["Clash-Medium"],
        // "ClashRegular": ["Clash-Regular"],
        // "ClashSemiBold": ["Clash-SemiBold"],
        // "ClashBold": ["Clash-Bold"],
      },
      textAlign: {
        'custom-left': 'left',
        'custom-center': 'center',
      },
      screens: {
        'md-down': {'max': '767px'}, // Added custom screen size for 768px and down
      },
      fontSize: {
        'custom-responsive': '24px', // Custom font size for 768px and down
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
  variants: {
    extend: {
      textAlign: ['responsive'], // Adding responsive variant for text-align
    },
  },
}
