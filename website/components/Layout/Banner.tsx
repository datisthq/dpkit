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
          <Trans>
            Looking for using a{" "}
            <strong>Data Package implementation in TypeScript</strong> as a
            library? It is now
          </Trans>{" "}
          <Anchor
            component={Link}
            to="https://github.com/frictionlessdata/frictionless-ts"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            frictionless-ts
          </Anchor>
          !
        </Text>
      </Container>
    </Box>
  )
}
