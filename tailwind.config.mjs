const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
        extend: {
            colors: {
                lightGray: "#858ebe",
                orange: "#F6B17A",
                darkGray: "#424769",
            },
            backgroundColor: {
                bgDark: "#111118",
                progressBar: "#7077A1",
            },
            fontFamily: {
                sans: ["Poppins", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
};
