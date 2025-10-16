import { ActionIcon } from "@mantine/core"
import * as icons from "#icons.ts"
import { useOpenShareDialog } from "./dialogs.ts"

export function TopbarShareButton() {
  const openShareDialog = useOpenShareDialog()

  const handleClick = () => {
    openShareDialog()
  }

  return (
    <ActionIcon
      color="blue"
      size={35}
      variant="outline"
      onClick={handleClick}
      bg="var(--mantine-primary-color-light)"
    >
      <icons.Share stroke={1.5} size="1.2em" />
    </ActionIcon>
  )
}
