import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 still uses the legacy @import API internally;
        // silence its known deprecation noise until it migrates to @use.
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'if-function'],
      }
    }
  },
  build: {
    // Split the framework out of the app chunk: React barely changes between
    // deploys, so a returning visitor keeps it cached while app code rolls over.
    rollupOptions: {
      // Deuxième page : /pdf/, outil de dépannage indépendant du portfolio.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        pdf: fileURLToPath(new URL('./pdf/index.html', import.meta.url)),
      },
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
