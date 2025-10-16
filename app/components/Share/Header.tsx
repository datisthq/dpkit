import { Box, Button, Group, Tooltip } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { usePayload } from "#components/System/index.ts"
import * as icons from "#icons.ts"
import { useOpenShareDialog } from "./dialogs.ts"

export function HeaderShareButton(props: {
  fullWidth?: boolean
}) {
  const { t } = useTranslation()
  const payload = usePayload()
  const isHome = payload.page.id === "home"
  const openShareDialog = useOpenShareDialog()

  const handleClick = () => {
    openShareDialog()
  }

  return (
    <Tooltip openDelay={300} label={t("Share Page")} position="left">
      <Button
        h={40}
        px="xs"
        variant={isHome ? "default" : "primary"}
        fullWidth={props.fullWidth}
        aria-label="Toggle full screen mode"
        onClick={handleClick}
      >
        <Group gap={5} wrap="nowrap">
          <icons.Share stroke={1.5} />
          <Box mr={4}>{t("Share")}</Box>
        </Group>
      </Button>
    </Tooltip>
  )
}
