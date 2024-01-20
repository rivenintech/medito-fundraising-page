import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
    site: "https://medito-fundraising-page.pages.dev",
    integrations: [
        tailwind({
            applyBaseStyles: false,
        }),
        react(),
    ],
    build: {
        // Example: Generate `page.html` instead of `page/index.html` during build.
        // Used to remove trailing slash on Cloudflare (https://developers.cloudflare.com/pages/platform/serving-pages/#route-matching)
        format: "file",
    },
});
