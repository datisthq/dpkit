import { Stack, Text, Title } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "about", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  return (
    <Stack gap="xl">
      <Title order={1}>About dpkit Cloud</Title>
      <Text size="xl">
        dpkit Cloud provides free online privacy-first tools for converting and
        validating data. Unlike others, dpkit Cloud is free and completely{" "}
        <Link to="https://github.com/datisthq/dpkit">open source</Link> allowing
        you to review the code or self-host the service. In 2025, the project
        was funded by{" "}
        <Link to="https://nlnet.nl/project/DataPackage-TS/">
          European Comission
        </Link>
        .
      </Text>
      <Stack gap="md">
        <Title order={2}>Self-hosting</Title>
        <Text size="lg">
          dpkit Cloud is completely open source and can be self-hosted. Visit
          our{" "}
          <Link to="https://github.com/datisthq/dpkit">GitHub repository</Link>{" "}
          to get started. For assistance with self-hosting or custom
          deployments, please{" "}
          <Link to="https://www.linkedin.com/in/evgeny-karev/">
            get in touch with us
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  )
}
