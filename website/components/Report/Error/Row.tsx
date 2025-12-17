import { Trans } from "@lingui/react/macro"
import { Code, Text } from "@mantine/core"
import type * as library from "frictionless-ts"

export function RowUniqueError(props: { error: library.RowUniqueError }) {
  return (
    <Text>
      <Trans>The cell values of the fields</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.fieldNames.join(", ")}
      </Code>{" "}
      <Trans>are not unique</Trans>
    </Text>
  )
}
