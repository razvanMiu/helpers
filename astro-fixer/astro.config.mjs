import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import solidJs from "@astrojs/solid-js";

// https://astro.build/config
export default defineConfig({
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
});
