import { Trans } from "@lingui/react/macro"
import { Stack, Text, Title } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "about", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  return (
    <Stack gap="xl">
      <Title order={1}>
        <Trans>About dpkit</Trans>
      </Title>
      <Text size="xl">
        <Trans>
          dpkit provides free online privacy-first tools for converting and
          validating data. Unlike others, dpkit is free and completely
        </Trans>{" "}
        <Link to="https://github.com/datisthq/dpkit">
          <Trans>open source</Trans>
        </Link>{" "}
        <Trans>allowing you to review the code or</Trans>{" "}
        <Trans>self-host</Trans>{" "}
        <Trans>the service. In 2025, the project was funded by</Trans>{" "}
        <Link to="https://nlnet.nl/project/DataPackage-TS/">
          <Trans>European Commission</Trans>
        </Link>
        .
      </Text>
      <Stack gap="md">
        <Title order={2}>
          <Trans>Privacy-first</Trans>
        </Title>
        <Text size="lg">
          <Trans>
            dpkit is a competely open source project being under constant
            peer-review. The code is transparent and auditable, ensuring your
            data is never collected on our servers and remains accessible only
            to you during processing. dpkit does not collect your data or store
            your data after processing.
          </Trans>
        </Text>
      </Stack>
      <Stack gap="md">
        <Title order={2}>
          <Trans>Self-hosting</Trans>
        </Title>
        <Text size="lg">
          <Trans>
            dpkit is completely open source and can be self-hosted. At the
            moment, the self-hosting documentation is under development. For
            assistance with self-hosting or custom deployments
          </Trans>{" "}
          <Link to="https://tally.so/r/QKKJ57">
            <Trans>get in touch with us</Trans>
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  )
}
