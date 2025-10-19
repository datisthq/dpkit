import { Container } from "@mantine/core"
import type { ReactNode } from "react"
import { Drawer as VaulDrawer } from "vaul"
import classes from "./Dialog.module.css"

// TODO: Rebase on snapPoints
export function Dialog(props: {
  open?: boolean
  title?: string
  children: ReactNode
  fullScreen?: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <VaulDrawer.Root open={props.open} onOpenChange={props.onOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={classes.overlay} />
        <VaulDrawer.Content
          className={classes.content}
          style={{ height: props.fullScreen ? "85vh" : "auto" }}
        >
          <Container size="lg">
            <div className={classes.handle} />
            {props.title && (
              <VaulDrawer.Title className={classes.title}>
                {props.title}
              </VaulDrawer.Title>
            )}
            <VaulDrawer.Description className={classes.description}>
              {props.children}
            </VaulDrawer.Description>
          </Container>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}
