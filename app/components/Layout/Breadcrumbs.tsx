import { Anchor, Breadcrumbs as MantineBreadcrumbs } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { Link } from "#components/Link/index.ts"
import { usePayload } from "#components/System/index.ts"
import { useMakeLink } from "#components/System/index.ts"

export function Breadcrumbs() {
  const { t } = useTranslation()
  const payload = usePayload()
  const makeLink = useMakeLink()

  if (payload.page.pageId === "home") {
    return null
  }

  return (
    <MantineBreadcrumbs>
      <Anchor to={makeLink({ pageId: "home" })} component={Link}>
        {t("Tools")}
      </Anchor>
      <Anchor to={makeLink({ pageId: "home" })} component={Link}>
        {payload.page.title[payload.language.languageId]}
      </Anchor>
    </MantineBreadcrumbs>
  )
}
