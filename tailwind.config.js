/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        footer: "350px 170px 170px 170px 170px",
        cart: "860px 300px",
        table: "300px 150px 160px 100px 50px",
        about: "230px 650px",
        aboutmid: "180px 526px",
        userDashboard: "180px 1000px",
      },
      fontFamily: {
        Poppins: ["Poppins", "sans-serif"],
      },
      screens: {
        sm: { max: "426px" },
        md: { min: "426px", max: "769px" },
        lg: { min: "769px" },
      },
      animation: {
        "scale-bounce": "scaleBounce 1.5s ease-out forwards",
        "fade-slide-up": "fadeSlideUp 0.8s ease-out forwards",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        scaleBounce: {
          "0%": {
            transform: "scale(0) rotate(-180deg)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.1) rotate(10deg)",
          },
          "100%": {
            transform: "scale(1) rotate(0deg)",
            opacity: "1",
          },
        },
        fadeSlideUp: {
          "0%": {
            transform: "translateY(30px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};
