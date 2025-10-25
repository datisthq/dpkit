import { createTheme } from "@mantine/core"

export const theme = createTheme({
  fontFamily: "system-ui, sans-serif",
  cursorType: "pointer",
  defaultRadius: "lg",
  // postcss.config.js needs to be changed to synced with these values
  breakpoints: {
    xs: "0em", // 0px - mobile
    sm: "30em", // 480px - tablet
    md: "50em", // 800px - desktop
    lg: "60em", // 960px
    xl: "80em", // 1280px
  },
  headings: {
    sizes: {
      h1: { fontSize: "26px" },
      h2: { fontSize: "24px" },
    },
  },
})
