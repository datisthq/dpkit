import { Anchor, Breadcrumbs as MantineBreadcrumbs } from "@mantine/core"
import { Text } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { TypeAnimation } from "react-type-animation"
import { Link } from "#components/Link/index.ts"
import { usePayload } from "#components/System/index.ts"
import { useMakeLink } from "#components/System/index.ts"

export function Breadcrumbs() {
  const { t } = useTranslation()
  const payload = usePayload()
  const makeLink = useMakeLink()

  return (
    <MantineBreadcrumbs>
      <Anchor to={makeLink({ pageId: "home" })} component={Link}>
        {t("Tools")}
      </Anchor>
      {payload.page.pageId === "home" ? (
        <Text color="dimmed">
          <TypeAnimation sequence={[t("Select from the list below")]} />
        </Text>
      ) : (
        <Anchor to={makeLink({ pageId: payload.page.pageId })} component={Link}>
          {payload.page.title[payload.language.languageId]}
        </Anchor>
      )}
    </MantineBreadcrumbs>
  )
}
