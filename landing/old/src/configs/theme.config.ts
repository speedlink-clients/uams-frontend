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
                accent: {
                    DEFAULT: { value: "#1273D4" },
                    50: { value: "#E7F1FB" },
                    100: { value: "#CFE3F7" },
                    200: { value: "#9FC7EF" },
                    300: { value: "#6EABE7" },
                    400: { value: "#3E8FDF" },
                    500: { value: "#1273D4" }, // Base Color #1273D4
                    600: { value: "#0E5CAA" },
                    700: { value: "#0B4580" },
                    800: { value: "#072E55" },
                    900: { value: "#04172B" },
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
                        value: "{colors.accent.500}", // Standard solid blue
                    },
                    muted: {
                        value: "{colors.accent.200}",
                    },
                    subtle: {
                        value: "{colors.accent.50}",
                    },
                    contrast: {
                        value: "{colors.white}", // Blue usually needs white text
                    },
                    fg: {
                        value: "{colors.accent.600}", 
                    },
                    emphasized: {
                        value: "{colors.accent.700}", 
                    },
                    focusRing: {
                        value: "{colors.accent.400}", 
                    },
                },
                border: {
                    default: {
                        value: {
                            base: "{colors.gray.200}",
                            _dark: "{colors.gray.700}", // Dark mode borders should be darker
                        },
                    },
                },
            },
        },
    },
});

const themeSystem = createSystem(defaultConfig, config);
export default themeSystem;