import { Box, ColorSchemeScript, MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useMemo, useState } from "react"
import { I18nextProvider } from "react-i18next"
import { locale } from "#locale.ts"
import { theme } from "#theme.ts"
import type * as types from "#types/index.ts"
import { SystemContext } from "./context.ts"

export function System(props: {
  payload: types.Payload
  children: React.ReactNode
}) {
  const { payload } = props
  const [queryClient] = useState(createQueryClient)

  const i18n = useMemo(() => {
    return locale.cloneInstance({ lng: payload.language.languageId })
  }, [payload.language.languageId])

  return (
    <SystemContext value={{ payload }}>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
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
