import { Box, ColorSchemeScript, MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { I18nextProvider } from "react-i18next"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { theme } from "#theme.ts"

export function System(props: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient)

  const i18n = useMemo(() => {
    return locale.cloneInstance({ lng: language.languageId })
  }, [language.languageId])

  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>{props.children}</I18nextProvider>
          <TanstackDevtools />
        </QueryClientProvider>
      </MantineProvider>
    </>
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

  // TODO: Chrome devtools hurts performance, so we use native devtools for now
  // @ts-ignore (enabling devtools)
  //globalThis.__TANSTACK_QUERY_CLIENT__ = queryClient

  return queryClient
}

function TanstackDevtools() {
  return (
    <Box visibleFrom="md">
      <ReactQueryDevtools />
    </Box>
  )
}
