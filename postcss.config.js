// postcss.config.js
export default {
  plugins: {
    'postcss-import': {}, // Handles @import rules
    'tailwindcss/nesting': {}, // For nested CSS (if needed)
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': { // For modern CSS features
      features: {
        'nesting-rules': true,
        'custom-media-queries': true,
        'media-query-ranges': true
      }
    }
  }
}