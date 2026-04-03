import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        military: {
          50: '#f6f6f1',
          600: '#5a5a4d',
          700: '#3d3d33',
          800: '#2a2a22',
          900: '#1a1a13',
        },
      },
    },
  },
  plugins: [],
};

export default config;
