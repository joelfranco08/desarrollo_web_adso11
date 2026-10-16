/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        meyer: {
          bgMain: '#FDFBF7',      // Fondo principal cálido / off-white
          card: '#F9F6F0',        // Fondo de tarjetas y campos crema suave
          gold: '#C5A059',        // Dorado elegante principal
          goldDark: '#B88E4B',    // Dorado oscuro para acentos / hover
          espresso: '#2E2A27',    // Marrón expreso para textos y botones
          muted: '#8C857B',       // Gris topo para textos secundarios
          border: '#EFECE6',      // Bordes sutiles
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 20px rgba(46, 42, 39, 0.04)',
      }
    },
  },
  plugins: [],
}