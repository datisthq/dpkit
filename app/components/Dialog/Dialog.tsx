import { Box, Button, Container, Flex } from "@mantine/core"
import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Drawer as VaulDrawer } from "vaul"
import classes from "./Dialog.module.css"

const snapPoints = [0.3, 0.9] as const

// TODO: Rebase on snapPoints
export function Dialog(props: {
  open?: boolean
  children: ReactNode
  fullScreen?: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { t } = useTranslation()
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
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={classes.overlay} />
        <VaulDrawer.Content className={classes.content}>
          <div className={classes.handle} />
          <Container size="lg" h="100%">
            <Flex
              gap={{ base: 20, md: 40 }}
              pt={{ base: 10, md: 20 }}
              direction="column"
              h="100%"
            >
              <Box>{props.children}</Box>
              <Button
                onClick={() => props.onOpenChange(false)}
                color="gray"
                fullWidth
                variant="outline"
                size="lg"
              >
                {t("Close")}
              </Button>
            </Flex>
          </Container>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  )
}
