// Use comments to prevent sorting
// ---
import "@mantine/core/styles.css"
import "#styles/custom.css"
// ---
import { useMatches } from "react-router"
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router"
import { isRouteErrorResponse } from "react-router"
import { JsonLd } from "react-schemaorg"
import { Layout as LayoutComponent } from "#components/Layout/index.ts"
import { Error } from "#components/System/index.ts"
import { System } from "#components/System/index.ts"
import { makeHeadLinks } from "#helpers/link.ts"
// import { getRevisionCacheControl } from "#helpers/revision.ts"
import { createPayload } from "#payload.ts"
import * as settings from "#settings.ts"
import type * as types from "#types/index.ts"
import type { Route } from "./+types/root.tsx"

// TODO: revover
// export function headers() {
//   return {
//     "Cache-Control": getRevisionCacheControl(),
//   }
// }

export default function Page() {
  return <Outlet />
}

export function ErrorBoundary(props: Route.ErrorBoundaryProps) {
  const code = isRouteErrorResponse(props.error) ? props.error.status : 500

  return <Error code={code} />
}

export function Layout(props: { children: React.ReactNode }) {
  const matches = useMatches()
  const route = matches.at(-1) as any

  const payload: types.Payload = route?.data?.payload ?? createPayload().payload
  const languageId = payload.language.languageId

  const pageId = payload.page.pageId
  const links = makeHeadLinks({ languageId, pageId })

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
        <meta property="og:url" content={links[0]?.href ?? settings.URL} />
        <meta property="og:site_name" content={settings.TITLE} />
        <meta property="og:locale" content={languageId} />

        <link rel="sitemap" type="text/xml" href="/sitemap.xml" />
        <link rel="icon" type="image/png" href="/favicon.png" />

        {links.map((link, index) => (
          <link
            key={index}
            rel={link.rel}
            href={link.href}
            hrefLang={link.hreflang}
          />
        ))}

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
          data-domain="dpkit.app"
          defer
        />

        <Links />
        <Meta />
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
