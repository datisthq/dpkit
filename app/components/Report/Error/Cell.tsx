import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

export function CellTypeError(props: { error: errorTypes.CellTypeError }) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      has a wrong type
    </Text>
  )
}

export function CellRequiredError(props: {
  error: errorTypes.CellRequiredError
}) {
  return (
    <Text>
      A required cell in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is missing
    </Text>
  )
}

export function CellMinimumError(props: {
  error: errorTypes.CellMinimumError
}) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is less than minimum
    </Text>
  )
}

export function CellMaximumError(props: {
  error: errorTypes.CellMaximumError
}) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is more than maximum
    </Text>
  )
}

export function CellExclusiveMinimumError(props: {
  error: errorTypes.CellExclusiveMinimumError
}) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is less or equal to exclusive minimum
    </Text>
  )
}

export function CellExclusiveMaximumError(props: {
  error: errorTypes.CellExclusiveMaximumError
}) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is more or equal to exclusive maximum
    </Text>
  )
}

export function CellMinLengthError(props: {
  error: errorTypes.CellMinLengthError
}) {
  return (
    <Text>
      Lenght of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is less than minimum
    </Text>
  )
}

export function CellMaxLengthError(props: {
  error: errorTypes.CellMaxLengthError
}) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is more or equal to exclusive maximum
    </Text>
  )
}

export function CellPatternError(props: {
  error: errorTypes.CellPatternError
}) {
  return (
    <Text>
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      does not match the pattern
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
      Value of the cell{" "}
      <Code fz="lg" fw="bold">
        {props.error.cell}
      </Code>
      in field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      of row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>
      is not in allowed values
    </Text>
  )
}
