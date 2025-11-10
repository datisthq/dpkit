import { Trans, useLingui } from "@lingui/react/macro"
import { Stack, Text, Title } from "@mantine/core"
import { Link } from "#components/Link/index.ts"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "about", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const { t } = useLingui()

  return (
    <Stack gap="xl">
      <Title order={1}>{t`about-dpkit-cloud-title`}</Title>
      <Text size="xl">
        {t`about-description-intro`}{" "}
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
        <Title order={2}>{t`about-privacy-first-title`}</Title>
        <Text size="lg">{t`about-privacy-first-description`}</Text>
      </Stack>
      <Stack gap="md">
        <Title order={2}>{t`about-self-hosting-title`}</Title>
        <Text size="lg">
          {t`about-self-hosting-intro`}{" "}
          <Link to="http://typescript.dpkit.app/guides/cloud/">
            {t`about-self-hosting-docs`}
          </Link>{" "}
          {t`about-self-hosting-middle`}{" "}
          <Link to="https://www.linkedin.com/in/evgeny-karev/">
            {t`about-get-in-touch`}
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  )
}
