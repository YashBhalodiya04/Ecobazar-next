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
    },
  },
  plugins: [],
};
