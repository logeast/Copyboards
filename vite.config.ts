import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-electron-plugin";
import { copy } from "vite-electron-plugin/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        settings: resolve(__dirname, "settings.html"),
      },
    },
  },
  plugins: [
    vue(),
    /**
     * @see https://github.com/electron-vite/vite-electron-plugin
     */
    electron({
      include: ["src/main", "src/lib", "src/preload", "package.json"],
      plugins: [
        copy([
          { from: "src/assets/*", to: "dist-electron/src/assets" },
          { from: "*.html", to: "dist-electron" },
        ]),
      ],
    }),
  ],
});
