import { Trans } from "@lingui/react/macro"
import type * as library from "@dpkit/library"
import { Code, Text } from "@mantine/core"

export function ForeignKeyError(props: { error: library.ForeignKeyError }) {
  return (
    <Text>
      <Trans>Foreign key violation in field(s)</Trans>{" "}
      <Code fz="lg" fw="bold">
        {props.error.foreignKey.fields.join(", ")}
      </Code>
      {": "}
      <Code fz="lg" fw="bold">
        {props.error.cells.join(", ")}
      </Code>
    </Text>
  )
}
