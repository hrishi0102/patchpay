/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue
          dark: '#2563EB',
        },
        secondary: {
          DEFAULT: '#10B981', // Green
          dark: '#059669',
        },
        dark: {
          DEFAULT: '#1F2937',
          lighter: '#374151',
          lightest: '#4B5563',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}