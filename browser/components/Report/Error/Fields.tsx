import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function FieldsMissingError(props: {
  error: errorTypes.FieldsMissingError
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
  error: errorTypes.FieldsExtraError
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
