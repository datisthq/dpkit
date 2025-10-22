import { Box, Group } from "@mantine/core"
import { Link } from "#components/Link/index.ts"

export function Navigation() {
  return (
    <Group fw="bold" wrap="nowrap">
      <Box>Cloud</Box>
      <Link to="https://dpkit.dev/overview/getting-started/">Terminal</Link>
      <Link to="https://typescript.dpkit.dev">TypeScript</Link>
    </Group>
  )
}
