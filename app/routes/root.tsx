// Use comments to prevent sorting
// ---
import "#styles/index.ts"
// ---
import { useMatches } from "react-router"
import { Outlet, Scripts, ScrollRestoration } from "react-router"
import { useRouteError } from "react-router"
import { isRouteErrorResponse } from "react-router"
import { useHref } from "react-router"
import { JsonLd } from "react-schemaorg"
import { Error } from "#components/Errors/index.ts"
import * as components from "#components/Layout/index.ts"
import { System } from "#components/System/index.ts"
import { createPayload } from "#payload.ts"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"

export function headers() {
  return {
    "Cache-Control": import.meta.env.PROD
      ? `public, max-age=${60 * 60 * 24}`
      : "private",
  }
}

export default function Page() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const code = isRouteErrorResponse(error) ? error.status : 500
  return <Error code={code} />
}

export function Layout() {
  const canonicalUrl = useHref("")

  const matches = useMatches()
  const route = matches.at(-1) as any

  const payload: types.Payload = route?.data?.payload ?? createPayload().payload
  const languageId = payload.language.languageId

  return (
    <html lang={languageId} dir="ltr">
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
        <meta property="og:locale" content={languageId} />

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

        <script
          src="https://plausible.io/js/script.js"
          data-domain="cloud.dpkit.dev"
          defer
        ></script>
      </head>

      <body>
        <System payload={payload}>
          <components.Layout>
            <Outlet />
          </components.Layout>
        </System>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
