/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        error: '#D33E3E',
        success: '#3ED33E',
        grey: '#EAEDE7',
        black: '#000000',
        orange: '#E98F0A',
        green: '#4B7367',
        red: '#d33e3e',
        'light-green': '#7B8F6A',
        'light-grey': '#FEFDFD',
      },
      keyframes: {
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideIn: {
          from: {
            transform: 'translateX(calc(100% + var(--viewport-padding)))',
          },
          to: { transform: 'translateX(0)' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        hide: 'hide 100ms ease-in',
        slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        swipeOut: 'swipeOut 100ms ease-out',
        bounce: 'bounce 0.5s infinite',
      },
      boxShadow: {
        status: '0 8px 8px 0 rgba(0, 0, 0, 0.24), 0 0 0 0 transparent',
      },
    },
  },
  plugins: [
    'prettier-plugin-tailwindcss',
    function customGradientUtilities({ addUtilities }) {
      const newUtilities = {
        '.gradient-slideshow-arrows': {
          backgroundImage: 'linear-gradient(transparent 25%, rgba(234, 237, 231, 0.5) 50%, transparent 75%)',
        },
      };
      addUtilities(newUtilities, ['hover']);
    },
  ],
};
