import type { api } from "#api/client.ts"
import { createStore } from "#helpers/store.ts"

export interface State {
  isDialogOpen?: boolean
  isPending?: boolean
  report?: Awaited<ReturnType<typeof api.package.validate>>
  error?: Error
}

export const store = createStore<State>("validatePackage")
