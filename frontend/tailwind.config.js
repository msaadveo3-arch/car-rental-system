export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Apple-inspired dark theme colors
        'apple-dark': {
          50: '#f5f5f7',
          100: '#e8e8ed',
          200: '#d2d2d7',
          300: '#aeaeb2',
          400: '#86868b',
          500: '#6e6e73',
          600: '#48484a',
          700: '#3a3a3c',
          800: '#2c2c2e',
          900: '#1c1c1e',
          950: '#000000',
        },
        'apple-accent': {
          blue: '#0071e3',
          purple: '#bf5af2',
          pink: '#ff375f',
          orange: '#ff9500',
          green: '#30d158',
          teal: '#64d2ff',
          indigo: '#5e5ce6',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'apple-sm': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'apple-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'apple-xl': '0 12px 32px rgba(0, 0, 0, 0.16)',
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '16px',
        'apple-xl': '20px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['dark'],
  },
};
