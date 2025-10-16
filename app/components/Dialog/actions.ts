import { modals } from "@mantine/modals"
import type { ReactNode } from "react"
import { createElement } from "react"
import { getIsDesktop } from "#helpers/media.ts"
import { DialogTitle } from "./Title.tsx"

export function openDialog(options: {
  title?: string
  Icon?: any
  children: ReactNode
  size?: "sm" | "md" | "lg" | "xl" | string
  trapFocus?: boolean
  fullScreen?: boolean
  onClose?: () => void
}) {
  const isDesktop = getIsDesktop()

  const title = options.title
    ? createElement(DialogTitle, {
        title: options.title,
        Icon: options.Icon,
      })
    : undefined

  if (isDesktop) {
    modals.open({
      title: !options.fullScreen ? title : undefined,
      withCloseButton: !options.fullScreen,
      children: options.children,
      size: options.size,
      fullScreen: options.fullScreen,
      onClose: options.onClose,
    })
  } else {
    modals.open({
      title,
      children: options.children,
      size: options.size,
      padding: "xs",
      yOffset: 0,
      withCloseButton: !!title,
      overlayProps: { backgroundOpacity: 0 },
      transitionProps: { transition: "slide-up" },
      fullScreen: options.fullScreen,
      trapFocus: options.trapFocus,
      onClose: options.onClose,
      styles: {
        body: {
          padding: 0,
          paddingTop: options.fullScreen ? 0 : undefined,
          paddingBottom: options.fullScreen ? 0 : undefined,
        },
        content: {
          position: "fixed",
          top: options.fullScreen ? 0 : undefined,
          bottom: 0,
          left: 0,
          right: 0,
          // TODO: extract to make reusable
          boxShadow:
            "0 -0.0625rem 0.1875rem rgba(0, 0, 0, 0.05), 0 -0.625rem 0.9375rem -0.3125rem rgba(0, 0, 0, 0.05), 0 -0.4375rem 0.4375rem -0.3125rem rgba(0, 0, 0, 0.04)",
        },
      },
    })
  }
}
