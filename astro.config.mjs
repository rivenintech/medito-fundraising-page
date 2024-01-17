import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
    integrations: [tailwind()],
    build: {
        // Example: Generate `page.html` instead of `page/index.html` during build.
        // Used to remove trailing slash on Cloudflare (https://developers.cloudflare.com/pages/platform/serving-pages/#route-matching)
        format: "file",
    },
});
