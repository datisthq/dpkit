import { Trans } from "@lingui/react/macro"
import { Box, Button, Container, Flex, ScrollArea } from "@mantine/core"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Drawer as VaulDrawer } from "vaul"
import classes from "./Dialog.module.css"

export function Dialog(props: {
  open?: boolean
  children: ReactNode
  fullScreen?: boolean
  onOpenChange: (open: boolean) => void
}) {
  const snapPoints = [0.5, 1] as const
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0])

  useEffect(() => {
    setSnap(props.fullScreen ? snapPoints[1] : snapPoints[0])
  }, [props.fullScreen])

  return (
    <VaulDrawer.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      activeSnapPoint={snap}
      snapPoints={snapPoints as any}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={0}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={classes.overlay} />
        <VaulDrawer.Content className={classes.content}>
          <Container size="lg" h="100%">
            <Flex gap={{ base: 20, md: 40 }} direction="column" h="100%">
              <Box className={classes.handle} />
              <VaulDrawer.Title className={classes.title}>
                <Trans>Dialog</Trans>
              </VaulDrawer.Title>
              <ScrollArea
                flex={props.fullScreen ? 1 : undefined}
                type={props.fullScreen ? "auto" : "never"}
              >
                {props.children}
              </ScrollArea>
              <Button
                onClick={() => props.onOpenChange(false)}
                color="gray"
                fullWidth
                variant="outline"
                size="lg"
              >
                <Trans>Close</Trans>
              </Button>
            </Flex>
          </Container>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}
