import type * as errorTypes from "@dpkit/lib"
import { Text } from "@mantine/core"

export function Error(props: {
  error: errorTypes.MetadataError | errorTypes.FileError | errorTypes.TableError
}) {
  switch (props.error.type) {
    case "metadata":
      return <MetadataError error={props.error} />
    case "file/bytes":
      return <BytesError error={props.error} />
    case "file/hash":
      return <HashError error={props.error} />
    case "fields/missing":
      return <FieldsMissingError error={props.error} />
    case "fields/extra":
      return <FieldsExtraError error={props.error} />
    case "field/name":
      return <FieldNameError error={props.error} />
    case "field/type":
      return <FieldTypeError error={props.error} />
    case "row/unique":
      return <RowUniqueError error={props.error} />
    case "cell/type":
      return <CellTypeError error={props.error} />
    case "cell/required":
      return <CellRequiredError error={props.error} />
    case "cell/minimum":
      return <CellMinimumError error={props.error} />
    case "cell/maximum":
      return <CellMaximumError error={props.error} />
    case "cell/exclusiveMinimum":
      return <CellExclusiveMinimumError error={props.error} />
    case "cell/exclusiveMaximum":
      return <CellExclusiveMaximumError error={props.error} />
    case "cell/minLength":
      return <CellMinLengthError error={props.error} />
    case "cell/maxLength":
      return <CellMaxLengthError error={props.error} />
    case "cell/pattern":
      return <CellPatternError error={props.error} />
    case "cell/unique":
      return <CellUniqueError error={props.error} />
    case "cell/enum":
      return <CellEnumError error={props.error} />
  }
}

export function MetadataError(props: { error: errorTypes.MetadataError }) {
  return (
    <Text>
      <strong>{props.error.keyword}</strong>
      {props.error.message && `: ${props.error.message}`}
      {props.error.instancePath && ` at ${props.error.instancePath}`}
    </Text>
  )
}

export function BytesError(props: { error: errorTypes.BytesError }) {
  return (
    <Text>
      File size mismatch: expected {props.error.bytes} bytes, got{" "}
      {props.error.actualBytes} bytes
    </Text>
  )
}

export function HashError(props: { error: errorTypes.HashError }) {
  return (
    <Text>
      File hash mismatch: expected {props.error.hash}, got{" "}
      {props.error.actualHash}
    </Text>
  )
}

export function FieldsMissingError(props: {
  error: errorTypes.FieldsMissingError
}) {
  return <Text>Missing fields: {props.error.fieldNames.join(", ")}</Text>
}

export function FieldsExtraError(props: {
  error: errorTypes.FieldsExtraError
}) {
  return <Text>Extra fields: {props.error.fieldNames.join(", ")}</Text>
}

export function FieldNameError(props: { error: errorTypes.FieldNameError }) {
  return (
    <Text>
      Field name mismatch: expected "{props.error.fieldName}", got "
      {props.error.actualFieldName}"
    </Text>
  )
}

export function FieldTypeError(props: { error: errorTypes.FieldTypeError }) {
  return (
    <Text>
      Field "{props.error.fieldName}" type mismatch: expected{" "}
      {props.error.fieldType}, got {props.error.actualFieldType}
    </Text>
  )
}

export function RowUniqueError(props: { error: errorTypes.RowUniqueError }) {
  return (
    <Text>
      Row {props.error.rowNumber} is not unique (fields:{" "}
      {props.error.fieldNames.join(", ")})
    </Text>
  )
}

export function CellTypeError(props: { error: errorTypes.CellTypeError }) {
  return (
    <Text>
      Cell type error at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellRequiredError(props: {
  error: errorTypes.CellRequiredError
}) {
  return (
    <Text>
      Required cell missing at row {props.error.rowNumber}, field "
      {props.error.fieldName}"
    </Text>
  )
}

export function CellMinimumError(props: {
  error: errorTypes.CellMinimumError
}) {
  return (
    <Text>
      Cell value below minimum at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellMaximumError(props: {
  error: errorTypes.CellMaximumError
}) {
  return (
    <Text>
      Cell value above maximum at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellExclusiveMinimumError(props: {
  error: errorTypes.CellExclusiveMinimumError
}) {
  return (
    <Text>
      Cell value at or below exclusive minimum at row {props.error.rowNumber},
      field "{props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellExclusiveMaximumError(props: {
  error: errorTypes.CellExclusiveMaximumError
}) {
  return (
    <Text>
      Cell value at or above exclusive maximum at row {props.error.rowNumber},
      field "{props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellMinLengthError(props: {
  error: errorTypes.CellMinLengthError
}) {
  return (
    <Text>
      Cell value too short at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellMaxLengthError(props: {
  error: errorTypes.CellMaxLengthError
}) {
  return (
    <Text>
      Cell value too long at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellPatternError(props: {
  error: errorTypes.CellPatternError
}) {
  return (
    <Text>
      Cell value doesn't match pattern at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellUniqueError(props: { error: errorTypes.CellUniqueError }) {
  return (
    <Text>
      Cell value is not unique at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}

export function CellEnumError(props: { error: errorTypes.CellEnumError }) {
  return (
    <Text>
      Cell value not in allowed values at row {props.error.rowNumber}, field "
      {props.error.fieldName}": {props.error.cell}
    </Text>
  )
}
