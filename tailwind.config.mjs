const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            // Change the colors values here
            colors: {
                orange: "#F6B17A",
            },
            ringColor: {
                darkGray: "#1d1e27",
            },
            textColor: {
                lightGray: "#858ebe",
            },
            backgroundColor: {
                progressBar: "#7077A1",
                primaryGray: "#0C0D11",
                secondaryGray: "#16171F",
            },
            // Changing the font: https://fontsource.org/docs/getting-started/install#setup
            // 3rd & 4th step in src/layouts/Layout.astro
            // Skip 5th step and just change the font name here
            fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
