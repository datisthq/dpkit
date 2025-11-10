import { Trans } from "@lingui/react/macro"
import { Anchor, Box, Text } from "@mantine/core"
import { Container } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { Link } from "#components/Link/index.ts"
import classes from "./Banner.module.css"

export function Banner() {
  const { t } = useTranslation()

  return (
    <Box className={classes.banner} py="xs">
      <Container size="lg">
        <Text>
          <Trans>Support the project by</Trans>
          <Anchor
            component={Link}
            to="https://github.com/sponsors/datisthq"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            {t("becoming a sponsor")}
          </Anchor>{" "}
          {t("or")}{" "}
          <Anchor
            component={Link}
            to="https://github.com/datisthq/dpkit/stargazers"
            rel="noopener noreferrer"
            c="white"
            fw="bold"
            td="underline"
          >
            {t("adding a star")}
          </Anchor>{" "}
          {t("on GitHub!")}
        </Text>
      </Container>
    </Box>
  )
}
