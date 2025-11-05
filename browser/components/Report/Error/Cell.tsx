import type * as errorTypes from "@dpkit/library"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function CellTypeError(props: { error: errorTypes.CellTypeError }) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is not")}
      <Code fz="lg" fw="bold">
        {[error.fieldType, error.fieldFormat].filter(Boolean).join("/")}
      </Code>{" "}
      {"type"}
    </Text>
  )
}

export function CellRequiredError(props: {
  error: errorTypes.CellRequiredError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("A required cell in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is missing")}
    </Text>
  )
}

export function CellMinimumError(props: {
  error: errorTypes.CellMinimumError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is less than")}
      <Code fz="lg" fw="bold">
        {error.minimum}
      </Code>{" "}
      {t("minimum")}
    </Text>
  )
}

export function CellMaximumError(props: {
  error: errorTypes.CellMaximumError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is more than")}
      <Code fz="lg" fw="bold">
        {error.maximum}
      </Code>{" "}
      {t("maximum")}
    </Text>
  )
}

export function CellExclusiveMinimumError(props: {
  error: errorTypes.CellExclusiveMinimumError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is less or equal to")}
      <Code fz="lg" fw="bold">
        {error.minimum}
      </Code>{" "}
      {t("exclusive minimum")}
    </Text>
  )
}

export function CellExclusiveMaximumError(props: {
  error: errorTypes.CellExclusiveMaximumError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is less or equal to")}
      <Code fz="lg" fw="bold">
        {error.maximum}
      </Code>{" "}
      {t("exclusive maximum")}
    </Text>
  )
}

export function CellMinLengthError(props: {
  error: errorTypes.CellMinLengthError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Length of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is less than")}
      <Code fz="lg" fw="bold">
        {error.minLength}
      </Code>{" "}
      {t("minimum")}
    </Text>
  )
}

export function CellMaxLengthError(props: {
  error: errorTypes.CellMaxLengthError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Length of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is more than")}
      <Code fz="lg" fw="bold">
        {error.maxLength}
      </Code>{" "}
      {t("maximum")}
    </Text>
  )
}

export function CellPatternError(props: {
  error: errorTypes.CellPatternError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("does not match the")}
      <Code fz="lg" fw="bold">
        {error.pattern}
      </Code>{" "}
      {t("pattern")}
    </Text>
  )
}

export function CellUniqueError(props: { error: errorTypes.CellUniqueError }) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is not unique")}
    </Text>
  )
}

export function CellEnumError(props: { error: errorTypes.CellEnumError }) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("is not in the allowed")}
      <Code fz="lg" fw="bold">
        {error.enum.join(", ")}
      </Code>{" "}
      {t("values")}
    </Text>
  )
}

export function CellJsonSchemaError(props: {
  error: errorTypes.CellJsonSchemaError
}) {
  const { t } = useTranslation()
  const { error } = props

  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      {t("does not match the")} JSON schema
    </Text>
  )
}
