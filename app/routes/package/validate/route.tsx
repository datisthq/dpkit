import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "packageValidate", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  return "packageValidate"
}
