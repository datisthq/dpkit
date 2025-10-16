import { Box, ColorSchemeScript, MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { omit } from "es-toolkit"
import { useMemo, useState } from "react"
import { I18nextProvider } from "react-i18next"
import { i18n } from "#i18n.ts"
import { theme } from "#theme.ts"
import type * as types from "#types/index.ts"
import { SystemContext } from "./context.ts"

export function System(props: {
  payload: types.Payload
  children: React.ReactNode
}) {
  const { payload } = props
  const [queryClient] = useState(createQueryClient)

  const boundI18n = useMemo(() => {
    return i18n.cloneInstance({ lng: payload.language.languageId })
  }, [payload.language.languageId])

  return (
    <SystemContext value={omit(props, ["children"])}>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={boundI18n}>{props.children}</I18nextProvider>
          <TanstackDevtools />
        </QueryClientProvider>
      </MantineProvider>
    </SystemContext>
  )
}

function createQueryClient() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Number.POSITIVE_INFINITY,
        gcTime: Number.POSITIVE_INFINITY,
      },
    },
  })

  return queryClient
}

function TanstackDevtools() {
  return (
    <Box visibleFrom="md">
      <ReactQueryDevtools />
    </Box>
  )
}
