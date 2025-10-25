import { Stack } from "@mantine/core"
import { About } from "./About.tsx"
import { Sitemap } from "./Sitemap.tsx"

export function Footer() {
  return (
    <Stack component="footer">
      <Sitemap />
      <About />
    </Stack>
  )
}
