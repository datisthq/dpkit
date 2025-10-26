import { Stack } from "@mantine/core"
import { Credits } from "./Credits.tsx"
import { Sitemap } from "./Sitemap.tsx"

export function Footer() {
  return (
    <Stack component="footer">
      <Sitemap />
      <Credits />
    </Stack>
  )
}
