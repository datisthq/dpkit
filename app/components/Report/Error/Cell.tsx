import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

export function CellTypeError(props: { error: errorTypes.CellTypeError }) {
  return (
    <Text>
      Cell type error at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellRequiredError(props: {
  error: errorTypes.CellRequiredError
}) {
  return (
    <Text>
      Required cell missing at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
    </Text>
  )
}

export function CellMinimumError(props: {
  error: errorTypes.CellMinimumError
}) {
  return (
    <Text>
      Cell value below minimum at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellMaximumError(props: {
  error: errorTypes.CellMaximumError
}) {
  return (
    <Text>
      Cell value above maximum at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellExclusiveMinimumError(props: {
  error: errorTypes.CellExclusiveMinimumError
}) {
  return (
    <Text>
      Cell value at or below exclusive minimum at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellExclusiveMaximumError(props: {
  error: errorTypes.CellExclusiveMaximumError
}) {
  return (
    <Text>
      Cell value at or above exclusive maximum at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellMinLengthError(props: {
  error: errorTypes.CellMinLengthError
}) {
  return (
    <Text>
      Cell value too short at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellMaxLengthError(props: {
  error: errorTypes.CellMaxLengthError
}) {
  return (
    <Text>
      Cell value too long at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellPatternError(props: {
  error: errorTypes.CellPatternError
}) {
  return (
    <Text>
      Cell value doesn't match pattern at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellUniqueError(props: { error: errorTypes.CellUniqueError }) {
  return (
    <Text>
      Cell value is not unique at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}

export function CellEnumError(props: { error: errorTypes.CellEnumError }) {
  return (
    <Text>
      Cell value not in allowed values at row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      , field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      :{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
    </Text>
  )
}
