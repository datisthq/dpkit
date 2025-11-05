import type * as errorTypes from "@dpkit/library"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

// TODO: improve error message
export function ForeignKeyError(props: { error: errorTypes.ForeignKeyError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Foreign key violation in field(s)")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.foreignKey.fields.join(", ")}
      </Code>
      {": "}
      <Code fz="lg" fw="bold">
        {props.error.cells.join(", ")}
      </Code>
    </Text>
  )
}
