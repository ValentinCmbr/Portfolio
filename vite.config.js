import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Bootstrap 5.3 still uses the legacy @import API internally;
        // silence its known deprecation noise until it migrates to @use.
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'if-function'],
      }
    }
  }
})