import { Trans } from "@lingui/react/macro"
import { Anchor, Box, Text } from "@mantine/core"
import { Container } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import classes from "./Banner.module.css"

export function Banner() {
  return (
    <Box className={classes.banner} py="xs">
      <Container size="lg">
        <Text>
          <Trans>Support the project by</Trans>{" "}
          <Anchor
            component={Link}
            to="https://github.com/sponsors/datisthq"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            <Trans>becoming a sponsor</Trans>
          </Anchor>{" "}
          <Trans>or</Trans>{" "}
          <Anchor
            component={Link}
            to="https://github.com/datisthq/dpkit/stargazers"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            <Trans>adding a star</Trans>
          </Anchor>{" "}
          <Trans>on GitHub!</Trans>
        </Text>
      </Container>
    </Box>
  )
}
