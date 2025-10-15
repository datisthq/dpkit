// Use comments to prevent sorting
// ---
import "#styles/index.ts"
// ---
import { Box, ColorSchemeScript, MantineProvider } from "@mantine/core"
import { Button, Container, Group, Text, Title } from "@mantine/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useMemo, useState } from "react"
import { I18nextProvider } from "react-i18next"
import { useTranslation } from "react-i18next"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { useRouteError } from "react-router"
import { isRouteErrorResponse } from "react-router"
import { useHref } from "react-router"
import { JsonLd } from "react-schemaorg"
import { LanguageIdDefault, Languages } from "#constants/language.ts"
import { locale } from "#locale.ts"
import * as settings from "#settings.ts"
import { theme } from "#theme.ts"
import type { Route } from "./+types/root.ts"
import classes from "./root.module.css"

export function headers() {
  return {
    "Cache-Control": `public, max-age=${60 * 60 * 24}`,
  }
}

export function Layout(props: Route.ComponentProps) {
  const canonicalUrl = useHref("")
  const [queryClient] = useState(createQueryClient)

  const language =
    Object.values(Languages).find(
      language => language.languageId === props.params.languageId,
    ) ?? Languages[LanguageIdDefault]

  const i18n = useMemo(() => {
    return locale.cloneInstance({ lng: language.languageId })
  }, [language.languageId])

  return (
    <html lang={language.languageId} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <title>{settings.TITLE}</title>
        <meta name="description" content={settings.DESCRIPTION} />

        <meta property="og:title" content={settings.TITLE} />
        <meta property="og:description" content={settings.DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content={settings.TITLE} />
        <meta property="og:locale" content={language.languageId} />

        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" type="image/png" href="/favicon.png" />

        <JsonLd
          item={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: settings.TITLE,
            url: settings.URL,
          }}
        />

        <Meta />
        <Links />
      </head>

      <body>
        <ColorSchemeScript defaultColorScheme="auto" />
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <QueryClientProvider client={queryClient}>
            <I18nextProvider i18n={i18n}>
              <Outlet />
            </I18nextProvider>
            <TanstackDevtools />
          </QueryClientProvider>
        </MantineProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const code = isRouteErrorResponse(error) ? error.status : 500
  const { t } = useTranslation()

  const title = code === 404 ? t("Page not found") : t("Something went wrong")
  const text = code === 404 ? t("error404") : t("error500")

  return (
    <Container className={classes.errorRoot}>
      <div className={classes.errorLabel}>{code}</div>
      <Title className={classes.errorTitle}>{title}</Title>
      <Text
        c="dimmed"
        size="lg"
        ta="center"
        className={classes.errorDescription}
      >
        {text}
      </Text>
      <Group justify="center">
        <Button size="md" component="a" variant="light" href="/">
          {t("Take me back to home page")}
        </Button>
      </Group>
    </Container>
  )
}

export default function Page() {
  return <Outlet />
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
