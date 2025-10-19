import { Button, Stack } from "@mantine/core"
import { useTranslation } from "react-i18next"
import { Drawer } from "#components/Drawer/index.ts"
import { Status } from "#components/Status/index.ts"
import { store } from "./store.ts"

export function Dialog() {
  const { t } = useTranslation()
  const report = store.useState(state => state.report)
  const isPending = store.useState(state => state.isPending)
  const isDialogOpen = store.useState(state => state.isDialogOpen)

  const handleOpenChange = (isDialogOpen: boolean) => {
    store.setState({ isDialogOpen, report: undefined })
  }

  const getStatus = () => {
    if (report) return report.valid ? "success" : "error"
    return isPending ? "pending" : undefined
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleOpenChange}>
      <Stack>
        <Status
          status={getStatus()}
          pendingTitle={t("Validating data package...")}
          successTitle={t("Valid data package")}
          errorTitle={t("Invalid data package")}
        />

        <Button
          onClick={() => handleOpenChange(false)}
          color="gray"
          fullWidth
          variant="outline"
          size="lg"
        >
          {t("Close")}
        </Button>
      </Stack>
    </Drawer>
  )
}
