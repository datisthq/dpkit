import { Container } from "@mantine/core"
import type { ReactNode } from "react"
import { Drawer as VaulDrawer } from "vaul"
import classes from "./Drawer.module.css"

// TODO: support proper snap points
export function Drawer(props: {
  open?: boolean
  title?: string
  size?: "sm" | "md" | "lg"
  children: ReactNode
  onOpenChange: (open: boolean) => void
}) {
  const size = props.size ?? "md"
  const height = size === "sm" ? "25vh" : size === "md" ? "50vh" : "75vh"

  return (
    <VaulDrawer.Root open={props.open} onOpenChange={props.onOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={classes.overlay} />
        <VaulDrawer.Content className={classes.content} style={{ height }}>
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
