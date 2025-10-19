import { Button, Center, Group } from "@mantine/core"
import { CheckCircle, Loader, XCircle } from "lucide-react"
import { Drawer } from "#components/Drawer/index.ts"
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
          {progress === "starting" && (
            <Center style={{ flexDirection: "column", gap: "24px" }}>
              <Group>
                <Loader
                  size={100}
                  style={{
                    animation: "spin 1s linear infinite",
                    color: "var(--mantine-color-blue-6)",
                  }}
                />
                <span style={{ fontSize: "50px", fontWeight: "600" }}>
                  Starting private container...
                </span>
              </Group>
            </Center>
          )}
          {progress === "pending" && (
            <Center style={{ flexDirection: "column", gap: "24px" }}>
              <Group>
                <Loader
                  size={100}
                  style={{
                    animation: "spin 1s linear infinite",
                    color: "var(--mantine-color-yellow-6)",
                  }}
                />
                <span style={{ fontSize: "50px", fontWeight: "600" }}>
                  Validating data package...
                </span>
              </Group>
            </Center>
          )}
          {isValid && (
            <Center style={{ flexDirection: "column", gap: "24px" }}>
              <Group>
                <CheckCircle size={100} style={{ color: "#10b981" }} />
                <span style={{ fontSize: "50px", fontWeight: "600" }}>
                  Valid data package
                </span>
              </Group>
            </Center>
          )}
          {isInvalid && (
            <Center style={{ flexDirection: "column", gap: "24px" }}>
              <Group>
                <XCircle size={100} style={{ color: "#ef4444" }} />
                <span style={{ fontSize: "50px", fontWeight: "600" }}>
                  Invalid data package
                </span>
                <pre
                  style={{
                    textAlign: "left",
                    width: "100%",
                    overflow: "auto",
                    fontSize: "12px",
                    marginTop: "16px",
                  }}
                >
                  {JSON.stringify(report, null, 2)}
                </pre>
              </Group>
            </Center>
          )}
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
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </Drawer>
  )
}
