import { Trans } from "@lingui/react/macro"
import { Code, Text } from "@mantine/core"
import type * as library from "frictionless-ts"

export function FieldNameError(props: { error: library.FieldNameError }) {
  return (
    <Text>
      <Trans>Field name</Trans> <Trans>is expected to be</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      <Trans>but it is actually</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualFieldName}
      </Code>
    </Text>
  )
}

export function FieldTypeError(props: { error: library.FieldTypeError }) {
  return (
    <Text>
      <Trans>Field</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldName}
      </Code>{" "}
      <Trans>is expected to be</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldType}
      </Code>{" "}
      <Trans>but it is actually</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualFieldType}
      </Code>
    </Text>
  )
}
