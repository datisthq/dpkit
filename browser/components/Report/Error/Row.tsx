import type * as errorTypes from "@dpkit/library"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function RowUniqueError(props: { error: errorTypes.RowUniqueError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("The cell values of the fields")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldNames.join(", ")}
      </Code>{" "}
      {t("are not unique")}
    </Text>
  )
}
