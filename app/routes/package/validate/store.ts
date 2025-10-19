import { createStore } from "#helpers/store.ts"
import type { validatePackage } from "./services.ts"

export interface State {
  isDialogOpen?: boolean
  progress?: "starting" | "pending"
  report?: Awaited<ReturnType<typeof validatePackage>>
}

export const store = createStore<State>()
