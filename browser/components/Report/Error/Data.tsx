import type * as errorTypes from "@dpkit/lib"
import { Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function DataError(props: { error: errorTypes.DataError }) {
  const { t } = useTranslation()

  return <Text>{t(props.error.message as any)}</Text>
}
