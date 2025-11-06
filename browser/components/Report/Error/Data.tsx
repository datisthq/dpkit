import type * as library from "@dpkit/library"
import { Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function DataError(props: { error: library.DataError }) {
  const { t } = useTranslation()

  return <Text>{t(props.error.message as any)}</Text>
}
