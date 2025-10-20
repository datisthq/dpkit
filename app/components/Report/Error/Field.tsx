import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function FieldNameError(props: { error: errorTypes.FieldNameError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Field name is expected to be")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("but it is actually")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualFieldName}
      </Code>
    </Text>
  )
}

export function FieldTypeError(props: { error: errorTypes.FieldTypeError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("is expected to be")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldType}
      </Code>{" "}
      {t("but it is actually")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualFieldType}
      </Code>
    </Text>
  )
}
