import { useLingui } from "@lingui/react/macro"
import type * as library from "@dpkit/library"
import { Code, Text } from "@mantine/core"
import { capitalize } from "es-toolkit"

export function MetadataError(props: { error: library.MetadataError }) {
  const { t } = useLingui()

  return (
    <Text>
      {capitalize(t`${props.error.message}`)} {t`at`}{" "}
      <Code fz="lg" fw="bold">
        {props.error.pointer}
      </Code>
    </Text>
  )
}
