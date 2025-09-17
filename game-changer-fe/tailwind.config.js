/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 다크모드 활성화
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'modal-scale': 'modalScale 0.2s ease-out',
        'blob': "blob 7s infinite", // ✨ 이 줄을 추가하세요
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalScale: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // ✨ 아래 blob 키프레임을 추가하세요
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '25%': {
            transform: 'translate(60px, -80px) scale(1.1) rotate(15deg)', // 이동 거리, 크기, 회전값 추가
          },
          '50%': {
            transform: 'translate(-50px, 100px) scale(0.9) rotate(-10deg)', // 반대 방향으로 이동 및 회전
          },
          '75%': {
            transform: 'translate(90px, -40px) scale(1.2) rotate(5deg)', // 다른 방향으로 더 크게 이동
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1) rotate(0deg)', // 원래 상태로 복귀
          },
        },
      },
    },
  },
  plugins: [],
}