/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0e1a',
          800: '#1a1f2e',
          700: '#252a3a',
          600: '#323854',
          500: '#4a5568',
        },
        accent: {
          500: '#667eea',
          600: '#5a67d8',
          700: '#4c51bf',
        },
        success: '#48bb78',
        danger: '#f56565',
        warning: '#ed8936',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #667eea, 0 0 10px #667eea, 0 0 15px #667eea' },
          '100%': { boxShadow: '0 0 10px #667eea, 0 0 20px #667eea, 0 0 30px #667eea' }
        }
      }
    },
  },
  plugins: [],
}
