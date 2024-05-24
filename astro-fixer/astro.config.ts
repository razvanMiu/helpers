import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";
import fetchCache from "fetch-cache/astro";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
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
    fetchCache({
      redisConfig: {
        url: "redis://localhost:6379",
      },
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
