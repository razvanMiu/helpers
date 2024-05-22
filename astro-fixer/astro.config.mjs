import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  redirects: {
    "/": "/dashboard",
  },
  integrations: [
    tailwind(),
    solidJs({
      devtools: true,
    }),
    {
      name: "jsoneditor",
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          injectScript(
            "before-hydration",
            `
              import JSONEditor from "jsoneditor/dist/jsoneditor.min.js";
              window.JSONEditor = JSONEditor;
            `
          );
        },
      },
    },
  ],
  adapter: node({
    mode: "standalone",
  }),
});
