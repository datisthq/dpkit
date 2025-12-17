import { Trans } from "@lingui/react/macro"
import { Code, Text } from "@mantine/core"
import type * as library from "frictionless-ts"

export function BytesError(props: { error: library.BytesError }) {
  return (
    <Text>
      <Trans>File size</Trans> <Trans>is expected to be</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.bytes} bytes
      </Code>{" "}
      <Trans>but it is actually</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualBytes} bytes
      </Code>
    </Text>
  )
}

export function HashError(props: { error: library.HashError }) {
  return (
    <Text>
      <Trans>File hash</Trans> <Trans>is expected to be</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.hash}
      </Code>{" "}
      <Trans>but it is actually</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualHash}
      </Code>
    </Text>
  )
}

export function EncodingError(props: { error: library.EncodingError }) {
  return (
    <Text>
      <Trans>File encoding</Trans> <Trans>is expected to be</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.encoding}
      </Code>{" "}
      <Trans>but it is actually</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualEncoding}
      </Code>
    </Text>
  )
}
