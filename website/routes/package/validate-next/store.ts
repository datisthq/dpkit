import { createStore } from "#helpers/store.ts"
import type { engine } from "#services/engine.ts"

export interface State {
  isDialogOpen?: boolean
  isPending?: boolean
  report?: Awaited<ReturnType<typeof engine.package.validate>>
  error?: Error
}

export const store = createStore<State>("validatePackage")
