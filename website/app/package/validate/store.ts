import { createStore } from "#helpers/store.ts"
import type { api } from "#services/api.ts"

export interface State {
  isDialogOpen?: boolean
  isPending?: boolean
  report?: Awaited<ReturnType<typeof api.package.validate>>
  error?: Error
}

export const store = createStore<State>("validatePackage")
