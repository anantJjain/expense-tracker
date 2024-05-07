/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        heading:['Kanit'],
      },
      colors:{
        green1:'hsl(120,100%,10%)',
        green2:'hsl(120,100%,20%)',
        green3:'hsl(120,100%,30%)',
        green4:'hsl(120,100%,40%)',
      },
      screens:{
        'sm1': '20px',
        'sm2':'375px',
        'sm3':'425px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1536px',
        '4xl':'1700px'
      }
    },
  },
  plugins: [],
}

