module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        animation: {
          'fade-in-left': 'fadeInLeft 1s ease-out',
          'fade-in-right': 'fadeInRight 1s ease-out',
          'float': 'float 6s infinite ease-in-out',
          'pulse': 'pulse 2s infinite',
        },
        maxWidth: {
          'screen': '100vw',
        },
        keyframes: {
          fadeInLeft: {
            '0%': { opacity: '0', transform: 'translateX(-50px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          fadeInRight: {
            '0%': { opacity: '0', transform: 'translateX(50px)' },
            '100%': { opacity: '1', transform: 'translateX(0)' },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-15px)' },
          },
          pulse: {
            '0%, 100%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
          }
        },
      },
    },
    plugins: [],
  }