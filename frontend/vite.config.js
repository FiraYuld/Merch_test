import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Разрешаем движку принимать запросы с любых адресов (чтобы ngrok всегда работал)
    allowedHosts: true
  }
})