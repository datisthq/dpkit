import { Box, Group } from "@mantine/core"
import { Link } from "#components/Link/index.ts"

export function Navigation() {
  return (
    <Group fw="bold" wrap="nowrap">
      <Box>Web</Box>
      <Link to="https://terminal.dpkit.app">Terminal</Link>
      <Link to="https://typescript.dpkit.app">TypeScript</Link>
    </Group>
  )
}
