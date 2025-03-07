import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [reactRouter(), tailwindcss(),
    nodePolyfills({
      include: ['buffer'],
    })
  ],
  mode: 'development',
  build: {
    minify: false
  },
});
