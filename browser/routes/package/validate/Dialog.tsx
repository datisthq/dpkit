import { useLingui } from "@lingui/react/macro"
import { Dialog } from "#components/Dialog/index.ts"
import { Report } from "#components/Report/index.ts"
import { Status } from "#components/Status/index.ts"
import { store } from "./store.ts"

export function ValidatePackageDialog() {
  const { t } = useLingui()
  const error = store.useState(state => state.error)
  const report = store.useState(state => state.report)
  const isPending = store.useState(state => state.isPending)
  const isDialogOpen = store.useState(state => state.isDialogOpen)

  const handleOpenChange = (isDialogOpen: boolean) => {
    store.setState({ isDialogOpen, error: undefined, report: undefined })
  }

  const getStatus = () => {
    if (report) return report.valid ? "success" : "error"
    if (isPending) return "pending"
    if (error) return "error"
    return undefined
  }

  const getErrorTitle = () => {
    if (error) return t`${error.message}`
    return "Invalid data package"
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleOpenChange}
      fullScreen={!!report?.errors.length}
    >
      <Status
        status={getStatus()}
        pendingTitle={t`Validating data package...`}
        successTitle={t`Valid data package`}
        errorTitle={getErrorTitle()}
      />

      <Report errors={report?.errors as any} />
    </Dialog>
  )
}
