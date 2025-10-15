import { Layout } from "#components/Layout/index.ts"
import type { Route } from "./+types/route.tsx"

export default function Page(props: Route.ComponentProps) {
  return <Layout pageId="home" languageId={props.params.languageId} />
}
