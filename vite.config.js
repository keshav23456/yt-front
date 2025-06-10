import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: false, // Temporarily disable PostCSS
  },
  
  // ESBuild configuration for JSX handling
  esbuild: {
    loader: "jsx",
    include: [
      // Handle .js files with JSX
      /src\/.*\.[jt]sx?$/,
      /src\/.*\.js$/,
    ],
    exclude: []
  },
  
  // Optimize dependencies
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  // Development server configuration
  server: {
    port: 3000, // Changed from 5173 to 3000
    host: true,
    open: true,
    // Proxy API requests to backend during development
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        // Optional: rewrite path if needed
        // rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  
  // Environment variables configuration
  define: {
    __API_BASE_URL__: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1')
  }
})
