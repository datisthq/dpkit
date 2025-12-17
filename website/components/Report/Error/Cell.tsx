import { Trans } from "@lingui/react/macro"
import { Code, Text } from "@mantine/core"
import type * as library from "frictionless-ts"

export function CellTypeError(props: { error: library.CellTypeError }) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is not</Trans>
      <Code fz="lg" fw="bold">
        {[error.fieldType, error.fieldFormat].filter(Boolean).join("/")}
      </Code>{" "}
      {"type"}
    </Text>
  )
}

export function CellRequiredError(props: {
  error: library.CellRequiredError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>A required cell in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is missing</Trans>
    </Text>
  )
}

export function CellMinimumError(props: {
  error: library.CellMinimumError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is less than</Trans>
      <Code fz="lg" fw="bold">
        {error.minimum}
      </Code>{" "}
      <Trans>minimum</Trans>
    </Text>
  )
}

export function CellMaximumError(props: {
  error: library.CellMaximumError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is more than</Trans>
      <Code fz="lg" fw="bold">
        {error.maximum}
      </Code>{" "}
      <Trans>maximum</Trans>
    </Text>
  )
}

export function CellExclusiveMinimumError(props: {
  error: library.CellExclusiveMinimumError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is less or equal to</Trans>
      <Code fz="lg" fw="bold">
        {error.minimum}
      </Code>{" "}
      <Trans>exclusive minimum</Trans>
    </Text>
  )
}

export function CellExclusiveMaximumError(props: {
  error: library.CellExclusiveMaximumError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is less or equal to</Trans>
      <Code fz="lg" fw="bold">
        {error.maximum}
      </Code>{" "}
      <Trans>exclusive maximum</Trans>
    </Text>
  )
}

export function CellMinLengthError(props: {
  error: library.CellMinLengthError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Length of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is less than</Trans>
      <Code fz="lg" fw="bold">
        {error.minLength}
      </Code>{" "}
      <Trans>minimum</Trans>
    </Text>
  )
}

export function CellMaxLengthError(props: {
  error: library.CellMaxLengthError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Length of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is more than</Trans>
      <Code fz="lg" fw="bold">
        {error.maxLength}
      </Code>{" "}
      <Trans>maximum</Trans>
    </Text>
  )
}

export function CellPatternError(props: {
  error: library.CellPatternError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>does not match the</Trans>
      <Code fz="lg" fw="bold">
        {error.pattern}
      </Code>{" "}
      <Trans>pattern</Trans>
    </Text>
  )
}

export function CellUniqueError(props: { error: library.CellUniqueError }) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is not unique</Trans>
    </Text>
  )
}

export function CellEnumError(props: { error: library.CellEnumError }) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>is not in the allowed</Trans>
      <Code fz="lg" fw="bold">
        {error.enum.join(", ")}
      </Code>{" "}
      <Trans>values</Trans>
    </Text>
  )
}

export function CellJsonSchemaError(props: {
  error: library.CellJsonSchemaError
}) {
  const { error } = props

  return (
    <Text>
      <Trans>Value of the cell</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.cell}
      </Code>{" "}
      <Trans>in field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.fieldName}
      </Code>{" "}
      <Trans>of row</Trans>{" "}
      <Code fz="lg" fw="bold">
        {error.rowNumber}
      </Code>{" "}
      <Trans>does not match the</Trans> JSON schema
    </Text>
  )
}
