import type * as library from "@dpkit/library"
import { Code, Text } from "@mantine/core"
import { capitalize } from "es-toolkit"
import { useTranslation } from "react-i18next"

export function MetadataError(props: { error: library.MetadataError }) {
  const { t } = useTranslation()

  return (
    <Text>
      {capitalize(t(props.error.message as any))} {t("at")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.pointer}
      </Code>
    </Text>
  )
}
