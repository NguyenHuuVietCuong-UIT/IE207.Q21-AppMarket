/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Định nghĩa màu Xanh dương đậm chủ đạo cho App Market
        primary: {
          DEFAULT: '#1e3a8a', // Xanh đậm 
          light: '#3b82f6',
          hover: '#1e40af',
        }
      }
    },
  },
  plugins: [
    // Plugin ẩn thanh cuộn ngang nhưng vẫn cho phép cuộn bằng tay/chuột
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}