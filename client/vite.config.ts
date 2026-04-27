import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), VitePWA(manifestForPlugIn)],
// })


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const manifestForPlugIn: Partial<VitePWAOptions> = {
    registerType: "autoUpdate",
    manifest:{
      name: "Blaue Bohne Barrel Tracker",
      short_name: env.VITE_NAME,
      description: "App to keep track of the Pfand barrels distributed by Blaue Bohne Kaffee Rösterei.",
      icons: [
      {
        src: '/maskable_icon_x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/maskable_icon_x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
    ],
    theme_color: '#0083D0',
    background_color: '#fff',
    display: "standalone",
    scope: '/',
    start_url: "/",
    // orientation:'portrait'
    }
  }

  return {
    plugins: [
      react(),
      VitePWA(manifestForPlugIn)
    ]
  };
});