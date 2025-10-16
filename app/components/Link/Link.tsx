import { omit } from "es-toolkit"
import type { ComponentProps } from "react"
import { Link as ReactRouterLink } from "react-router"
import { useMakeLink } from "#components/System/index.ts"

export function Link(
  props: ComponentProps<typeof ReactRouterLink> & {
    to: string | Parameters<ReturnType<typeof useMakeLink>>[0]
    target?: "_blank"
  },
) {
  const makeLink = useMakeLink()
  const propsWithoutTo = omit(props, ["to"])

  let href = undefined
  if (typeof props.to === "string") {
    href = props.to
  } else if ("pageId" in props.to) {
    href = makeLink(props.to)
  } else {
    throw new Error(`Invalid Link props: ${props}`)
  }

  return (
    <ReactRouterLink
      viewTransition
      to={href}
      prefetch="intent"
      {...propsWithoutTo}
    />
  )
}
