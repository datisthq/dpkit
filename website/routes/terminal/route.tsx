import { Anchor, Code, List, Stack, Text, Title } from "@mantine/core"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

// TODO: Add sidebar (TOC)
// TODO: Add translations

export async function clientLoader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "terminal", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  return (
    <Stack gap="xl" maw={800}>
      <Stack gap="md">
        <Title order={1}>Terminal Application</Title>
        <Text size="lg">
          This guide will help you get started with dpkit in Terminal. If you
          are new to the core framework's technologies, please take a look at
          the{" "}
          <Anchor
            href="https://datapackage.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Data Package standard
          </Anchor>{" "}
          and{" "}
          <Anchor
            href="https://pola.rs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Polars DataFrames
          </Anchor>{" "}
          documentation.
        </Text>
      </Stack>

      <Stack gap="md">
        <Title order={2}>Prerequisites</Title>
        <Text>Supported operating systems:</Text>
        <List>
          <List.Item>
            <strong>Linux</strong> (x64/arm64)
          </List.Item>
          <List.Item>
            <strong>macOS</strong> (x64/arm64)
          </List.Item>
          <List.Item>
            <strong>Windows</strong> (x64)
          </List.Item>
        </List>
      </Stack>

      <Stack gap="md">
        <Title order={2}>Installation</Title>

        <Stack gap="sm">
          <Text>
            You can download the latest binary from the{" "}
            <Anchor
              href="https://github.com/datisthq/dpkit/releases"
              target="_blank"
              rel="noopener noreferrer"
            >
              releases page
            </Anchor>{" "}
            or use the following command (for POSIX-compatible shells including
            Git for Windows):
          </Text>
          <Code block>curl -fsSL https://dpkit.app/install.sh | sh</Code>
          <Text>
            After downloading, you can verify the binary using the following
            command:
          </Text>
          <Code block>./dpkit --version</Code>
          <Text>
            We recommend adding the binary to your PATH environment variable to
            make it easier to use.
          </Text>
        </Stack>

        <Stack gap="sm">
          <Title order={2}>Usage</Title>
          <Text>See the usage instructions:</Text>
          <Code block>dpkit --help</Code>
        </Stack>
      </Stack>
    </Stack>
  )
}
