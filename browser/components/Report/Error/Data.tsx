import { useLingui } from "@lingui/react/macro"
import type * as library from "@dpkit/library"
import { Text } from "@mantine/core"

export function DataError(props: { error: library.DataError }) {
  const { t } = useLingui()

  return <Text>{t`${props.error.message}`}</Text>
}
