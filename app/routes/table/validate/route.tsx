import { useTranslation } from "react-i18next"
import { Alert } from "#components/Alert/Alert.tsx"
import { createPayload } from "#payload.ts"
import type { Route } from "./+types/route.tsx"

export async function loader({ params }: Route.LoaderArgs) {
  const { payload } = createPayload({ pageId: "tableValidate", params })

  return { payload }
}

export default function Page(_props: Route.ComponentProps) {
  const { t } = useTranslation()
  return (
    <Alert
      title={t("Under Construction")}
      description={t(
        "This tool is currently under construction and not yet available",
      )}
    />
  )
}
