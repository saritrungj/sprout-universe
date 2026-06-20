import { defineConfig } from "vite";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Marketing landing page → served at /
        main: resolve(__dirname, "index.html"),
        // Sprout Planner module → served at /app/
        app: resolve(__dirname, "app/index.html"),
      },
    },
  },
});
