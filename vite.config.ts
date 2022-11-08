import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-electron-plugin";
import { copy } from "vite-electron-plugin/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    /**
     * @see https://github.com/electron-vite/vite-electron-plugin
     */
    electron({
      include: ["src/main", "src/lib", "src/preload", "package.json"],
      plugins: [
        copy([{ from: "src/assets/*", to: "dist-electron/src/assets" }]),
      ],
    }),
  ],
});
