import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
    base: '/lecturer/',
    server: {
      allowedHosts: ['computerscience.uniport.edu.ng', 'localhost'],
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), tsconfigPaths()],
})
