import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

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
