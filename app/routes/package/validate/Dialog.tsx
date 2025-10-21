import { useTranslation } from "react-i18next"
import { Dialog } from "#components/Dialog/index.ts"
import { Report } from "#components/Report/index.ts"
import { Status } from "#components/Status/index.ts"
import { store } from "./store.ts"

export function ValidatePackageDialog() {
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
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      fullScreen={!!report?.errors.length}
    >
      <Status
        status={getStatus()}
        pendingTitle={t("Validating data package...")}
        successTitle={t("Valid data package")}
        errorTitle={t("Invalid data package")}
      />

      <Report errors={report?.errors} />
    </Dialog>
  )
}
