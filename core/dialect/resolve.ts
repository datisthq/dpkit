import { loadDialect } from "../dialect/index.ts"
import type { Dialect } from "./Dialect.ts"

export async function resolveDialect(dialect?: Dialect | string) {
  if (!dialect) {
    return undefined
  }

  if (typeof dialect !== "string") {
    return dialect
  }

  return await loadDialect(dialect)
}
