import type * as library from "@dpkit/library"
import { Trans } from "@lingui/react/macro"
import { Code, Text } from "@mantine/core"

export function FieldsMissingError(props: {
  error: library.FieldsMissingError
}) {
  return (
    <Text>
      <Trans>The fields</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldNames.join(", ")}
      </Code>{" "}
      <Trans>are missing</Trans>
    </Text>
  )
}

export function FieldsExtraError(props: {
  error: library.FieldsExtraError
}) {
  return (
    <Text>
      <Trans>The fields</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldNames.join(", ")}
      </Code>{" "}
      <Trans>are not expected</Trans>
    </Text>
  )
}
