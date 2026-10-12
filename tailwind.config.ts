import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1020',
        paper: '#F5F3EE',
        lime: '#D7F36B',
        indigo: '#5D5FEF',
        coral: '#FF7B6B',
        mist: '#E8E7E2',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 40px rgba(11, 16, 32, 0.08)',
        lift: '0 18px 50px rgba(11, 16, 32, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
