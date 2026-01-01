/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette CEDII améliorée avec variations
        'cedii': {
          // Votre palette originale
          'primary': '#5811EE',
          'primary-dark': '#04058F',
          'dark': '#02061E',
          'secondary': '#067186',
          'neutral': '#55555E',
          
          // Variations pour meilleur contraste
          'primary-light': '#7340F2',
          'primary-lighter': '#8F6AF5',
          'secondary-light': '#0D9AAD',
          'neutral-light': '#73737D',
          
          // États système
          'success': '#10B981',
          'warning': '#F59E0B',
          'error': '#EF4444',
          'info': '#3B82F6',
          
          // Nuances de gris
          'gray-50': '#F9FAFB',
          'gray-100': '#F3F4F6',
          'gray-200': '#E5E7EB',
          'gray-300': '#D1D5DB',
          'gray-400': '#9CA3AF',
          'gray-500': '#6B7280',
          'gray-600': '#4B5563',
          'gray-700': '#374151',
          'gray-800': '#1F2937',
          'gray-900': '#111827',
        }
      },
      backgroundImage: {
        'gradient-cedii': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'gradient-cedii-primary': 'linear-gradient(135deg, #5811EE 0%, #04058F 100%)',
        'gradient-cedii-dark': 'linear-gradient(135deg, #04058F 0%, #02061E 100%)',
        'gradient-cedii-light': 'linear-gradient(135deg, #067186 0%, #0D9AAD 100%)',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'cedii': '12px',
        'cedii-lg': '16px',
        'cedii-xl': '20px',
      },
      boxShadow: {
        'cedii': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'cedii-lg': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'cedii-xl': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'cedii-inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-cedii': 'pulseCedii 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseCedii: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        }
      }
    },
  },
  plugins: [],
  // Important: S'assurer que Tailwind ne clash pas avec Bootstrap
  corePlugins: {
    preflight: false, // Désactive le reset CSS de Tailwind pour éviter les conflits avec Bootstrap
  }
}