import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-electron-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    electron({
      include: ["electron"],
    }),
  ],
});
