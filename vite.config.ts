import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,

    // OPTION A (recommended for your case): allow CodeSandbox host(s)
    allowedHosts: [
      "cvwq25-5173.csb.app",
      ".csb.app", // allows any csb.app subdomain
    ],

    // OPTION B (quickest for demos): allow all hosts
    // allowedHosts: true
  },
});
