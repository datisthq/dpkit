import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function BytesError(props: { error: errorTypes.BytesError }) {
  const { t } = useTranslation()

  return (
    <Text>
      {t("File size")} {t("is expected to be")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.bytes} bytes
      </Code>{" "}
      {t("but it is actually")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualBytes} bytes
      </Code>
    </Text>
  )
}

export function HashError(props: { error: errorTypes.HashError }) {
  const { t } = useTranslation()

  return (
    <Text>
      {t("File hash")} {t("is expected to be")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.hash}
      </Code>{" "}
      {t("but it is actually")}{" "}
      <Code fz="lg" fw="bold">
        {props.error.actualHash}
      </Code>
    </Text>
  )
}
