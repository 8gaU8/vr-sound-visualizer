import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  console.log('Loading environment variables for mode:', mode)
  return {
    base: mode === 'production' ? '/vr-sound-visualizer/' : '',
  }
})
