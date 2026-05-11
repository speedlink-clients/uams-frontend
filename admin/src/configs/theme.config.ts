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
                slate: {
                    50: { value: "#f8fafc" },
                    100: { value: "#f1f5f9" },
                    200: { value: "#e2e8f0" },
                    300: { value: "#cbd5e1" },
                    400: { value: "#94a3b8" },
                    500: { value: "#64748b" },
                    600: { value: "#475569" },
                    700: { value: "#334155" },
                    800: { value: "#1e293b" },
                    900: { value: "#0f172a" },
                },
                accent: {
                    DEFAULT: {
                        value: "#1d76d2", // main brand accent
                    },
                    50: {
                        value: "#f8f8ff", // very light tint
                    },
                    100: {
                        value: "#f0f0ff",
                    },
                    200: {
                        value: "#e1e1ff",
                    },
                    300: {
                        value: "#d2d2ff",
                    },
                    400: {
                        value: "#c3c3ff",
                    },
                    500: {
                        value: "#1d76d2", // base purple
                    },
                    600: {
                        value: "#2220c8",
                    },
                    700: {
                        value: "#1b1ba5",
                    },
                    800: {
                        value: "#14167e",
                    },
                    900: {
                        value: "#0d1157",
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