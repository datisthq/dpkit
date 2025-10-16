import { modals } from "@mantine/modals"
import { useEffect } from "react"
import { useEffectEvent } from "use-effect-event"
import { useLocation } from "#components/System/index.ts"

export function useDialogEvents() {
  usePageEnter()
}

function usePageEnter() {
  const location = useLocation()

  const handlePageEnter = useEffectEvent(() => {
    modals.closeAll()
  })

  useEffect(() => {
    handlePageEnter()
  }, [location])
}
