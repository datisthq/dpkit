import { Box, Stack, Text, Title } from "@mantine/core"
import { usePayload } from "#components/System/index.ts"
import { Pages } from "#constants/page.ts"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"
import { Dialog } from "./Dialog.tsx"
import { Form } from "./Form.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "packageValidate", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const { languageId } = usePayload()
  const page = Pages.packageValidate

  return (
    <Box>
      <Stack gap="md">
        <Title order={1}>{page.title[languageId]}</Title>
        <Text size="lg">{page.description[languageId]}</Text>
        <Form />
      </Stack>

      <Dialog />
    </Box>
  )
}
