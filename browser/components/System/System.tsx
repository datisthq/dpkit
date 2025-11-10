import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { ColorSchemeScript, MantineProvider } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { omit } from "es-toolkit"
import { useMemo, useState } from "react"
import { I18nextProvider } from "react-i18next"
import { getRevisionStaleTime } from "#helpers/revision.ts"
import { i18n as i18nLegacy } from "#i18n.ts"
import { theme } from "#theme.ts"
import type * as types from "#types/index.ts"
import { SystemContext } from "./context.ts"

export function System(props: {
  payload: types.Payload
  children: React.ReactNode
}) {
  const { payload } = props
  const [queryClient] = useState(createQueryClient)

  const i18nForLanguage = useMemo(() => {
    return i18nLegacy.cloneInstance({ lng: payload.language.languageId })
  }, [payload.language.languageId])

  return (
    <SystemContext value={omit(props, ["children"])}>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider theme={theme} defaultColorScheme="auto">
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18nForLanguage}>
            <I18nProvider i18n={i18n}>{props.children}</I18nProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </MantineProvider>
    </SystemContext>
  )
}

function createQueryClient() {
  const staleTime = getRevisionStaleTime()

  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime, gcTime: staleTime } },
  })

  // @ts-ignore (enabling devtools)
  globalThis.__TANSTACK_QUERY_CLIENT__ = queryClient

  return queryClient
}
