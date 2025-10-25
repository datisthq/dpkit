import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function CellTypeError(props: { error: errorTypes.CellTypeError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("has a wrong type")}
    </Text>
  )
}

export function CellRequiredError(props: {
  error: errorTypes.CellRequiredError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("A required cell in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is missing")}
    </Text>
  )
}

export function CellMinimumError(props: {
  error: errorTypes.CellMinimumError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is less than minimum")}
    </Text>
  )
}

export function CellMaximumError(props: {
  error: errorTypes.CellMaximumError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is more than maximum")}
    </Text>
  )
}

export function CellExclusiveMinimumError(props: {
  error: errorTypes.CellExclusiveMinimumError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is less or equal to exclusive minimum")}
    </Text>
  )
}

export function CellExclusiveMaximumError(props: {
  error: errorTypes.CellExclusiveMaximumError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is more or equal to exclusive maximum")}
    </Text>
  )
}

export function CellMinLengthError(props: {
  error: errorTypes.CellMinLengthError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Length of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is less than minimum")}
    </Text>
  )
}

export function CellMaxLengthError(props: {
  error: errorTypes.CellMaxLengthError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Length of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is more than maximum")}
    </Text>
  )
}

export function CellPatternError(props: {
  error: errorTypes.CellPatternError
}) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("does not match the pattern")}
    </Text>
  )
}

export function CellUniqueError(props: { error: errorTypes.CellUniqueError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is not unique")}
    </Text>
  )
}

export function CellEnumError(props: { error: errorTypes.CellEnumError }) {
  const { t } = useTranslation()
  return (
    <Text>
      {t("Value of the cell")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>{" "}
      {t("in field")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      {t("of row")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      {t("is not in allowed values")}
    </Text>
  )
}
