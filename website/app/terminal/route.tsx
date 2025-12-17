import { Trans } from "@lingui/react/macro"
import { Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { usePayload } from "#components/System/index.ts"
import { useMakeLink } from "#components/System/index.ts"
import { Pages } from "#constants/page.ts"
import { createPayload } from "#payload.ts"
import * as settings from "#settings.ts"
import type { Route } from "./+types/route.tsx"
import classes from "./route.module.css"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "terminal", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const payload = usePayload()
  const makeLink = useMakeLink()

  const tools = Object.values(Pages).filter(page => page.pageId !== "home")

  return (
    <Stack gap="xl">
      <Stack gap="md">
        <Title order={1} fz={40} style={{ whiteSpace: "nowrap" }}>
          dpkit{" "}
          <Text component="span" color="dimmed" fz={{ base: "lg", md: "xl" }}>
            / data processing kit /
          </Text>
        </Title>
        <Text size="xl">
          <Trans>Free online tools for</Trans>{" "}
          <Text component="span" fw="bold" td="underline">
            <Trans>converting and validating data</Trans>
          </Text>
          . <Trans>Unlike others, dpkit Cloud is</Trans>{" "}
          <Link to={makeLink({ pageId: "about" })}>
            <Trans>privacy-first</Trans>
          </Link>{" "}
          <Trans>and completely</Trans>{" "}
          <Link to="https://github.com/datisthq/dpkit">
            <Trans>open source</Trans>
          </Link>{" "}
          <Trans>allowing you to review the code or</Trans>{" "}
          <Link to={makeLink({ pageId: "about" })}>
            <Trans>self-host</Trans>
          </Link>{" "}
          <Trans>the service. In 2025, the project was funded by</Trans>{" "}
          <Link to="https://nlnet.nl/project/DataPackage-TS/">
            <Trans>European Commission</Trans>
          </Link>
          .
        </Text>
      </Stack>
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {tools.map(tool => {
          if (!tool.Icon) return null
          return (
            <Card
              key={tool.pageId}
              component={Link}
              to={makeLink({ pageId: tool.pageId })}
              shadow="sm"
              p={{ base: "md", md: "xl" }}
              radius="md"
              withBorder
              style={{ cursor: "pointer" }}
              className={classes.card}
            >
              <Group gap="sm" mb="md" wrap="nowrap">
                <tool.Icon
                  size={32}
                  strokeWidth={settings.ICON_STROKE_WIDTH}
                  style={{ color: tool.color, flexShrink: 0 }}
                  className={classes.icon}
                />
                <Title order={2} className={classes.title}>
                  {tool.title[payload.language.languageId]}
                </Title>
              </Group>
              <Text size="md">
                {tool.description[payload.language.languageId]}
              </Text>
            </Card>
          )
        })}
      </SimpleGrid>
    </Stack>
  )
}
