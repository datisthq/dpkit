import { Group } from "@mantine/core"
import { Breadcrumbs } from "./Breadcrumbs.tsx"
import classes from "./Header.module.css"
import { Language } from "./Language.tsx"
import { Logo } from "./Logo.tsx"
import { Navigation } from "./Navigation.tsx"
import { Theme } from "./Theme.tsx"

export function Header() {
  return (
    <Group component="header" className={classes.root} align="center">
      <Logo />
      <Group flex={1} visibleFrom="md">
        <Breadcrumbs />
      </Group>
      <Group>
        <Navigation />
        <Theme />
        <Language />
      </Group>
    </Group>
  )
}
