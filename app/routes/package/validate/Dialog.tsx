import { Container } from "@mantine/core"
import { Drawer } from "vaul"

export function Dialog(props: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Drawer.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Drawer.Portal>
        <Drawer.Overlay
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        />
        <Drawer.Content
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50%",
            backgroundColor: "white",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            padding: "16px",
          }}
        >
          <Container size="lg">
            <div
              style={{
                width: "40px",
                height: "5px",
                backgroundColor: "#d1d5db",
                borderRadius: "9999px",
                margin: "8px auto 16px",
              }}
            />
            <Drawer.Title
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              Validation Results
            </Drawer.Title>
            <Drawer.Description style={{ marginBottom: "16px" }}>
              Data package validation in progress...
            </Drawer.Description>
          </Container>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
