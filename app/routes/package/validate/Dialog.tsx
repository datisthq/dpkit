import { Drawer } from "#components/Drawer/index.ts"
import { store } from "./store.ts"

export function Dialog() {
  const report = store.useState(state => state.report)
  const isDialogOpen = store.useState(state => state.isDialogOpen)

  const handleOpenChange = (isDialogOpen: boolean) => {
    store.setState({ isDialogOpen, report: undefined })
  }

  return (
    <Drawer open={isDialogOpen} onOpenChange={handleOpenChange}>
      {report
        ? JSON.stringify(report)
        : "Data package validation in progress..."}
    </Drawer>
  )
}
