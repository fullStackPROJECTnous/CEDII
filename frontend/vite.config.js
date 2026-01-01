/*import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
    resolve: {
    alias: {
      // Définir l'alias '@' pour pointer vers le dossier 'src'
      '@': path.resolve(__dirname, './src'), resolvers: [NaiveUiResolver()]
    }
  }
})


// Pour Volar support


// frontend/vite.config.js

// 1. Importer le module 'path' de Node.js
import * as path from 'path'; 

*/

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: true // Optionnel : génère les types TypeScript
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  optimizeDeps: {
    include: ['naive-ui']
  }
})
