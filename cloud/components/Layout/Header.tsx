import { Box, Flex } from "@mantine/core"
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
    <Flex
      component="header"
      className={classes.root}
      wrap="nowrap"
      align="center"
      px="sm"
      gap={{ base: 5, sm: 20 }}
    >
      <Logo />
      <Box flex={1}>
        <Flex visibleFrom="lg">
          <Breadcrumbs />
        </Flex>
      </Box>
      <Flex wrap="nowrap" gap={{ base: 5, sm: 20 }}>
        <Flex visibleFrom="md">
          <Navigation />
        </Flex>
        <Flex wrap="nowrap" gap={{ base: 5, sm: 10 }}>
          <Theme />
          <Language />
          <Share />
          <Repository />
        </Flex>
      </Flex>
    </Flex>
  )
}
