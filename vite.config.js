// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/VOL-T/", // YOUR REPO NAME HERE
  server: {
    port: 3000,
  },
});
