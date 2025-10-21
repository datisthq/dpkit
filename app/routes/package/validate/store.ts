import { createStore } from "#helpers/store.ts"
import type { validatePackage } from "./services.ts"

export interface State {
  isDialogOpen?: boolean
  isPending?: boolean
  isFault?: boolean
  report?: Awaited<ReturnType<typeof validatePackage>>
}

export const store = createStore<State>("validatePackage")
