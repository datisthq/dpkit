import type { ComponentProps } from "react"
import { createContext } from "#helpers/context.ts"
import type { System } from "./System.tsx"

export type SystemContext = Omit<ComponentProps<typeof System>, "children"> & {
  // Add your custom properties here
}

export const [SystemContext, useSystemContext] = createContext<SystemContext>()
