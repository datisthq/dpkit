import { Anchor, Box, Text } from "@mantine/core"
import { Container } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import classes from "./Banner.module.css"

export function Banner() {
  return (
    <Box className={classes.banner} py="xs">
      <Container size="lg">
        <Text>
          Support the project by{" "}
          <Anchor
            component={Link}
            to="https://github.com/sponsors/datisthq"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            becoming a sponsor
          </Anchor>{" "}
          or{" "}
          <Anchor
            component={Link}
            to="https://github.com/datisthq/dpkit/stargazers"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            adding a star
          </Anchor>{" "}
          on GitHub!
        </Text>
      </Container>
    </Box>
  )
}
