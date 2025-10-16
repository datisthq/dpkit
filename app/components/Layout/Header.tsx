import { Box, Group } from "@mantine/core"
import { Breadcrumbs } from "./Breadcrumbs.tsx"
import classes from "./Header.module.css"
import { Language } from "./Language.tsx"
import { Logo } from "./Logo.tsx"
import { Navigation } from "./Navigation.tsx"
import { Theme } from "./Theme.tsx"

export function Header() {
  return (
    <Group component="header" className={classes.root} align="center" px="sm">
      <Logo />
      <Box flex={1}>
        <Box visibleFrom="md">
          <Breadcrumbs />
        </Box>
      </Box>
      <Group>
        <Box visibleFrom="md">
          <Navigation />
        </Box>
        <Theme />
        <Language />
      </Group>
    </Group>
  )
}
