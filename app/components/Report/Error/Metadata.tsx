import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

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
