// Use comments to prevent sorting
// ---
import "#styles"
// ---
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { useMatches, useParams, useRouteError } from "react-router"
import { isRouteErrorResponse } from "react-router"
import { JsonLd } from "react-schemaorg"
import { Error } from "#components/Error/index.ts"
import { Layout as LayoutComponent } from "#components/Layout/index.ts"
import { System } from "#components/System/index.ts"
import { makeLink } from "#helpers/link.ts"
import { createDefaultPayload } from "#payload.ts"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"

export default function Page() {
  return <Outlet />
}

export function ErrorBoundary() {
  const error = useRouteError()
  const code = isRouteErrorResponse(error) ? error.status : 500

  return <Error code={code} />
}

export function Layout(props: { children: React.ReactNode }) {
  const params = useParams()
  const matches = useMatches()

  const match = matches.at(-1) as any
  const payload: types.Payload =
    match?.data?.payload ?? createDefaultPayload().payload

  const pageId = payload.page.pageId
  const languageId = payload.language.languageId
  const canonicalLink = makeLink({ languageId, pageId, params })

  const title = [payload.page.title[languageId], settings.TITLE].join(" - ")
  const description = payload.page.description[languageId]

  return (
    <html lang={params.languageId} dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />

        <title>{title}</title>
        {!!description && <meta name="description" content={description} />}

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={links[0]?.href || settings.URL} />
        <meta property="og:site_name" content={settings.TITLE} />
        <meta property="og:locale" content={params.languageId} />

        <link rel="canonical" href="https://mycarro.app/en/portugal" />
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
        <System payload={payload}>
          <LayoutComponent>{props.children}</LayoutComponent>
        </System>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
