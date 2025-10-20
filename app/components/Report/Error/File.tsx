import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"

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
