import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

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
      <Code fz="lg" fw="bold">
        {props.error.keyword}
      </Code>
      {props.error.message && ` ${props.error.message}`}
      {props.error.instancePath && (
        <>
          {" at "}
          <Code fz="lg" fw="bold">
            {props.error.instancePath}
          </Code>
        </>
      )}
    </Text>
  )
}

export function BytesError(props: { error: errorTypes.BytesError }) {
  return (
    <Text>
      File size mismatch: expected{" "}
      <Code fz="lg" fw="bold">
        {props.error.bytes}
      </Code>{" "}
      bytes, got{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualBytes}
      </Code>{" "}
      bytes
    </Text>
  )
}

export function HashError(props: { error: errorTypes.HashError }) {
  return (
    <Text>
      File hash mismatch: expected{" "}
      <Code fz="lg" fw="bold">
        {props.error.hash}
      </Code>
      , got{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualHash}
      </Code>
    </Text>
  )
}

export function FieldsMissingError(props: {
  error: errorTypes.FieldsMissingError
}) {
  return (
    <Text>
      Missing fields:{" "}
      {props.error.fieldNames.map((name, i) => (
        <span key={i}>
          {i > 0 && ", "}
          <Code fz="lg" fw="bold">
            {name}
          </Code>
        </span>
      ))}
    </Text>
  )
}

export function FieldsExtraError(props: {
  error: errorTypes.FieldsExtraError
}) {
  return (
    <Text>
      Extra fields:{" "}
      {props.error.fieldNames.map((name, i) => (
        <span key={i}>
          {i > 0 && ", "}
          <Code fz="lg" fw="bold">
            {name}
          </Code>
        </span>
      ))}
    </Text>
  )
}

export function FieldNameError(props: { error: errorTypes.FieldNameError }) {
  return (
    <Text>
      Field name mismatch: expected{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>
      , got{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualFieldName}
      </Code>
    </Text>
  )
}

export function FieldTypeError(props: { error: errorTypes.FieldTypeError }) {
  return (
    <Text>
      Field{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      type mismatch: expected{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldType}
      </Code>
      , got{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualFieldType}
      </Code>
    </Text>
  )
}

export function RowUniqueError(props: { error: errorTypes.RowUniqueError }) {
  return (
    <Text>
      Row{" "}
      <Code fz="lg" fw="bold">
        {props.error.rowNumber}
      </Code>{" "}
      is not unique (fields:{" "}
      {props.error.fieldNames.map((name, i) => (
        <span key={i}>
          {i > 0 && ", "}
          <Code fz="lg" fw="bold">
            {name}
          </Code>
        </span>
      ))}
      )
    </Text>
  )
}

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
