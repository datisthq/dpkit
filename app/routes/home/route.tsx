import { Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const payload = usePayload()
  const makeLink = useMakeLink()

  const tools = Object.values(Pages).filter(page => page.pageId !== "home")

  return (
    <Stack gap="xl">
      <Stack gap="md">
        <Title order={1} size={40}>
          {t("dpkit Cloud")}
        </Title>
        <Text size="xl">
          {t("Free online tools for")}{" "}
          <Text component="span" fw="bold" td="underline">
            {t("converting and validating data")}
          </Text>
          . {t("Unlike others, dpkit Cloud is")}{" "}
          <Link to={makeLink({ pageId: "about" })}>{t("privacy-first")}</Link>{" "}
          {t("and completely")}{" "}
          <Link to="https://github.com/datisthq/dpkit">{t("open source")}</Link>{" "}
          {t("allowing you to review the code or")}{" "}
          <Link to={makeLink({ pageId: "about" })}>{t("self-host")}</Link>{" "}
          {t("the service. In 2025, the project was funded by")}{" "}
          <Link to="https://nlnet.nl/project/DataPackage-TS/">
            {t("European Commission")}
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
