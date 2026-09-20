import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
        },
      },
    },
  },
})
