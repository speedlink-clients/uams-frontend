import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
    globalCss: {
        body: {
            backgroundColor: "{colors.bg}",
            color: "{colors.gray.800}",
            _dark: {
                backgroundColor: "{colors.bg.subtle}",
                color: "{colors.white}",
            },
        },
    },
    theme: {
        tokens: {
            colors: {
                test: {
                    value: "pink"
                },
                accent: {
                    DEFAULT: {
                        value: "#1273D4", // main brand blue
                    },
                    50: {
                        value: "#F0F7FF", // very light blue
                    },
                    100: {
                        value: "#E0F0FF",
                    },
                    200: {
                        value: "#BBDDFF",
                    },
                    300: {
                        value: "#88C5FF",
                    },
                    400: {
                        value: "#55ACFF",
                    },
                    500: {
                        value: "#1273D4", // base blue from Figma
                    },
                    600: {
                        value: "#0E5BA8",
                    },
                    700: {
                        value: "#0B4A88",
                    },
                    800: {
                        value: "#083968",
                    },
                    900: {
                        value: "#052848",
                    },
                },
            },

            fonts: {
                heading: { value: "Inter, sans-serif" },
                body: { value: "Inter, sans-serif" },
            },
        },
        semanticTokens: {
            colors: {
                accent: {
                    solid: {
                        value: "{colors.accent.600}", // main solid color for buttons, etc.
                    },
                    muted: {
                        value: "{colors.accent.400}", // lighter for hover or subtle accents
                    },
                    subtle: {
                        value: "{colors.accent.100}", // for light backgrounds
                    },
                    contrast: {
                        value: "{colors.accent.50}", // strong contrast areas
                    },
                    fg: {
                        value: "{colors.accent.700}", // text accent color
                    },
                    emphasized: {
                        value: "{colors.accent.800}", // stronger emphasis (headings, etc.)
                    },
                    focusRing: {
                        value: "{colors.accent.500}", // focus outlines, inputs, etc.
                    },
                },
                border: {
                    default: {
                        value: {
                            base: "{colors.gray.200}",
                            _dark: "{colors.gray.200}",
                        },
                    },
                },
            },
        },
    },
});

const themeSystem = createSystem(defaultConfig, config);
export default themeSystem;