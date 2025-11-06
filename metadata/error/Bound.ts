import type { UnboundError } from "./Unbound.ts"

export type BoundError = UnboundError & { resource: string }
