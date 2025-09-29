/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  important: true,
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    animation: {
      'fade-in': 'fade-in 0.5s ease-out',
      'fade-up': 'fade-up 0.5s ease-out',
      spin: 'spin 1s linear infinite',
    },
    keyframes: {
      'fade-in': {
        '0%': {
          opacity: '0',
        },
        '100%': {
          opacity: '1',
        },
      },
      'fade-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(40px)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },

      spin: {
        '0%': {
          transform: 'rotate(0deg)',
        },
        '100%': {
          transform: 'rotate(360deg)',
        },
      },
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        danger: 'var(--color-danger-500)',
        success: 'var(--color-success-500)',
        warning: 'var(--color-warning-500)',
        'border-gray': 'var(--color-border-gray)',
        'light-gray': 'var(--color-light-gray)',
        'medium-gray': 'var(--color-medium-gray)',
        'dark-gray': 'var(--color-dark-gray)',
        'white': 'var(--color-white)',
        'black': 'var(--color-black)',
      },
      fontFamily: {
        primary: 'Product_sans',
        secondary: 'Bulletproof',
        urbanist: 'Urbanist',
        arabic: 'NotoSansArabic',
      },
      screens: {
        xsm: '375px',
        sm: '480px',
        md: '768px',
        lg: '1092px',
        xl: '1280px',
        '2xl': '1440px',
        xl1520: '1520px', // 👈 Custom screen at 1520px: '1520px', // 👈 Custom screen at 1520px
        '3xl': '1700px',
        '4xl': '1920px',
      },
      boxShadow: {
        primary: '0px 0px 15px var(--color-primary)',
      },
      spacing: {
        15: '3.75rem',
        18: '4.5rem',
        30: '7.5rem',
        50: '12.5rem',
        120: '30rem',
      },
    },
  },
  plugins: [
    plugin(({ addVariant, addUtilities }) => {
      addVariant('path-stroke', ['&>g>g>line', '&>g>g>path', '&>g>g>rect', '&>g>path', '&>g>line']),
        addVariant('path-fill', ['&>g>g>line', '&>g>g>path', '&>g>g>rect', '&>g>path', '&>g>line']),
        addVariant('select-svg', ['&>div>span>svg>g>path']),
        addUtilities({
          '.flex-centered': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
          '.centered-xy': {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
          '.custom-radius': {
            borderRadius: "3px"
          },
        });
    }),
  ],
};
