/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'matrix-green': '#00FF41',
                'cyber-yellow': '#FFD100',
                'punch-red': '#FF0000',
            },
            boxShadow: {
                'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
                'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
                'brutal-active': '0px 0px 0px 0px rgba(0,0,0,1)',
            },
            fontFamily: {
                'impact': ['"Impact"', 'sans-serif'],
                'noto-serif': ['"Noto Serif JP"', 'serif'],
            }
        },
    },
    plugins: [],
}
