import type * as errorTypes from "@dpkit/lib"
import { Code, Text } from "@mantine/core"
import { useTranslation } from "react-i18next"

export function MetadataError(props: { error: errorTypes.MetadataError }) {
  const { t } = useTranslation()

  return (
    <Text>
      <Code fz="lg" fw="bold">
        {props.error.keyword}
      </Code>
      {props.error.message && ` ${t(props.error.message as any)}`}
      {props.error.instancePath && (
        <>
          {" "}
          {t("at")}{" "}
          <Code fz="lg" fw="bold">
            {props.error.instancePath}
          </Code>
        </>
      )}
    </Text>
  )
}
