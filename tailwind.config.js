/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2A3E6C', // ou essa mais escura #1B2A4E
        'accent-orange': '#FF6B35', // Essa é mais clarinha #FF8A65 
        // Backgrounds
        'sidebar-bg': '#23395d', 
        'sidebar-hover': '#40587D', // ou essa mais escura #2f446a
      },
      fontFamily: {
        // Decidir qual vou querer (Open Sans, Inter, Poppins, etc.)
        'sans': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
