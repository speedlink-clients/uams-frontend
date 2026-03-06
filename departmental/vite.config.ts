import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  base: "/departmental-admin/",
  server: {
    allowedHosts: ['computerscience.uniport.edu.ng', 'localhost'],
    port: 3000,
    host: "0.0.0.0",
    strictPort: true,
  },
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
