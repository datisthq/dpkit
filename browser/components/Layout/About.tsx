import { Anchor, Box, Container, Image, Stack, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"
import datistLogoTextDark from "#assets/datist-logo-text-dark.svg"
import datistLogoTextLight from "#assets/datist-logo-text-light.svg"
import { Link } from "#components/Link/index.ts"
import classes from "./About.module.css"

export function About() {
  const { t } = useTranslation()

  return (
    <Container size="lg">
      <Stack
        component="article"
        gap="xs"
        align="center"
        maw="40rem"
        mx="auto"
        py="md"
      >
        <Text c="dimmed" size="sm">
          {t("Brought to you by")}
        </Text>
        <Box className={classes.imageContainer}>
          <Anchor
            component={Link}
            to="https://datist.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={datistLogoTextLight}
              alt="Datist"
              maw={300}
              radius="md"
              data-variant="light"
              className={classes.image}
            />
            <Image
              src={datistLogoTextDark}
              alt="Datist"
              maw={300}
              radius="md"
              data-variant="dark"
              className={classes.image}
            />
          </Anchor>
        </Box>
        <Text c="dimmed" ta="center" maw="50ch">
          {t(
            "We are bringing technological innovation and consultancy services to the open data field",
          )}
        </Text>
      </Stack>
    </Container>
  )
}
