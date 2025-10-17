import { Card, Group, SimpleGrid, Text, Title } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { usePayload } from "#components/System/index.ts"
import { useMakeLink } from "#components/System/index.ts"
import { Pages } from "#constants/page.ts"
import { createPayload } from "#payload.ts"
import * as settings from "#settings.ts"
import type { Route } from "./+types/route.tsx"
import classes from "./route.module.css"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "home", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const payload = usePayload()
  const makeLink = useMakeLink()

  const tools = Object.values(Pages).filter(page => page.pageId !== "home")

  return (
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
  )
}
