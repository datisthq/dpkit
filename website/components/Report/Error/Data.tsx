import { useLingui } from "@lingui/react/macro"
import { Text } from "@mantine/core"
import type * as library from "frictionless-ts"

export function DataError(props: { error: library.DataError }) {
  const { t } = useLingui()

  return <Text>{t`${props.error.message}`}</Text>
}
