import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // shadcn-style alias: "@/components/ui/..." resolves into src/
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
