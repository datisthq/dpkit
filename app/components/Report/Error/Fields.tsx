import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

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
