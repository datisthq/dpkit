import type { BoundError } from "./Bound.ts"
import type { UnboundError } from "./Unbound.ts"

export type DpkitError = BoundError | UnboundError
