import { Layout } from "#components/Layout/index.ts"
import type { Route } from "./+types/route.tsx"

export default function Page(props: Route.ComponentProps) {
  return <Layout pageId="tableConvert" languageId={props.params.languageId} />
}
