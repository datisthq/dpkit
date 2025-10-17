import { Box, Group } from "@mantine/core"
import { Breadcrumbs } from "./Breadcrumbs.tsx"
import classes from "./Header.module.css"
import { Language } from "./Language.tsx"
import { Logo } from "./Logo.tsx"
import { Navigation } from "./Navigation.tsx"
import { Repository } from "./Repository.tsx"
import { Share } from "./Share.tsx"
import { Theme } from "./Theme.tsx"

export function Header() {
  return (
    <Group
      component="header"
      className={classes.root}
      wrap="nowrap"
      align="center"
      px="sm"
      gap={0}
    >
      <Logo />
      <Gap double />
      <Box flex={1}>
        <Box visibleFrom="lg">
          <Breadcrumbs />
          <Gap double />
        </Box>
      </Box>
      <Group wrap="nowrap" gap={0}>
        <Group visibleFrom="md" wrap="nowrap" gap={0}>
          <Navigation />
          <Gap double />
        </Group>
        <Theme />
        <Gap />
        <Language />
        <Gap />
        <Share />
        <Gap />
        <Repository />
      </Group>
    </Group>
  )
}

function Gap(props: { double?: boolean }) {
  return <Box w={{ base: 5, sm: props.double ? 20 : 10 }} />
}
