import type * as library from "@dpkit/library"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function FieldsMissingError(props: {
  error: library.FieldsMissingError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("The fields")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldNames.join(", ")}
      </Code>{" "}
      {t("are missing")}
    </Text>
  )
}

export function FieldsExtraError(props: {
  error: library.FieldsExtraError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("The fields")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldNames.join(", ")}
      </Code>{" "}
      {t("are not expected")}
    </Text>
  )
}
