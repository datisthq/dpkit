import { createStore } from "#helpers/store.ts"
import type { api } from "#runtimes/browser/api.ts"

export interface State {
  isDialogOpen?: boolean
  isPending?: boolean
  isFault?: boolean
  report?: Awaited<ReturnType<typeof api.package.validate>>
}

export const store = createStore<State>("validatePackage")
