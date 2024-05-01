import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa'

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  manifest:{
    name:"Blaue Bohne Barrel Tracker",
    short_name:process.env.VITE_NAME,
    description:"App to keep track of the Pfand barrels distributed by Blaue Bohne Kaffee Rösterei.",
    icons:[
    {
      src: 'maskable_icon_x512.png',
      sizes:'512x512',
      type:'image/png',
      purpose:'any maskable'
    },
    {
      src:'assets/maskable_icon_x192.png',
      sizes:'192x192',
      type:'image/png',
      purpose:'any maskable'
    },
  ],
  theme_color:'#0083D0',
  background_color:'#fff',
  display:"standalone",
  scope:'/',
  start_url:"/",
  orientation:'portrait'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
})
