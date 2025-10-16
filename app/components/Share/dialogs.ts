import { createElement } from "react"
import { useTranslation } from "react-i18next"
import { openDialog } from "#components/Dialog/index.ts"
import { useOpenSharePresetDialog } from "#components/Preset/index.ts"
import { usePayload } from "#components/System/index.ts"
import * as icons from "#icons.ts"
import { ShareDialog } from "./Share.tsx"

export function useOpenShareDialog() {
  const { t } = useTranslation()
  const payload = usePayload()
  const openSharePresetDialog = useOpenSharePresetDialog()

  return () => {
    if (payload.page.id === "presetList") {
      openSharePresetDialog()
      return
    }

    openDialog({
      title: t("Share the page"),
      Icon: icons.Share,
      children: createElement(ShareDialog),
    })
  }
}
