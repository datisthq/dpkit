import { Container } from "@mantine/core"
import type { ReactNode } from "react"
import { Drawer as VaulDrawer } from "vaul"
import classes from "./Drawer.module.css"

export interface DrawerProps {
  open?: boolean
  title?: string
  children: ReactNode
  onOpenChange: (open: boolean) => void
}

// TODO: support proper snap points
export function Drawer(props: DrawerProps) {
  return (
    <VaulDrawer.Root open={props.open} onOpenChange={props.onOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={classes.overlay} />
        <VaulDrawer.Content className={classes.content}>
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
