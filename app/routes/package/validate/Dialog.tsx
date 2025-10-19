import { Button } from "@mantine/core"
import { Drawer } from "#components/Drawer/index.ts"
import { Status } from "#components/Status/index.ts"
import { store } from "./store.ts"

export function Dialog() {
  const report = store.useState(state => state.report)
  const progress = store.useState(state => state.progress)
  const isDialogOpen = store.useState(state => state.isDialogOpen)

  const handleOpenChange = (isDialogOpen: boolean) => {
    store.setState({ isDialogOpen, report: undefined })
  }

  const handleClose = () => {
    store.setState({ isDialogOpen: false, report: undefined })
  }

  const isValid = report && !report.errors?.length
  const isInvalid = report && report.errors?.length > 0

  const getStatus = () => {
    if (progress === "starting") return "starting"
    if (isValid) return "success"
    if (isInvalid) return "error"
    return "pending"
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleOpenChange}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "24px",
        }}
      >
        <div style={{ flex: 1, padding: "24px" }}>
          <Status
            status={getStatus()}
            pendingTitle="Validating data package..."
            successTitle="Valid data package"
            errorTitle="Invalid data package"
          />
        </div>

        <Button
          onClick={handleClose}
          color="gray"
          fullWidth
          variant="outline"
          size="lg"
        >
          Close
        </Button>
      </div>
    </Drawer>
  )
}
