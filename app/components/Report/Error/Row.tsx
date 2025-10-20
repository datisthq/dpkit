import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

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
