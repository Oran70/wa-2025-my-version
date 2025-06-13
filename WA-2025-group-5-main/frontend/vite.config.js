import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Load env file from current directory
  let env = loadEnv(mode, process.cwd(), '');

  // Try to load env from parent directory if it exists
  const rootEnvPath = path.resolve(process.cwd(), '../.env');
  if (fs.existsSync(rootEnvPath)) {
    const rootEnv = loadEnv(mode, path.resolve(process.cwd(), '..'), '');
    // Merge environment variables, giving priority to the local ones
    env = { ...rootEnv, ...env };
  }

  // Safely parse the client URL or use default
  let clientUrl;
  try {
    clientUrl = env.CLIENT_URL ? new URL(env.CLIENT_URL) : new URL('http://localhost:3000');
  } catch (error) {
    console.warn('Invalid CLIENT_URL, using default');
    clientUrl = new URL('http://localhost:3000');
  }

  return {
    plugins: [react()],
    server: {
      port: parseInt(clientUrl.port || '3000'),
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
