import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    resolve: {
    alias: {
      // Définir l'alias '@' pour pointer vers le dossier 'src'
      '@': path.resolve(__dirname, './src'), 
    }
  }
})


// frontend/vite.config.js

// 1. Importer le module 'path' de Node.js
import * as path from 'path'; 


  // 2. AJOUTER L'OBJET RESOLVE
