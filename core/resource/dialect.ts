import { loadDialect } from "../dialect/index.ts"
import type { Resource } from "./Resource.ts"

export async function loadResourceDialect(dialect: Resource["dialect"]) {
  if (!dialect) {
    return undefined
  }

  if (typeof dialect !== "string") {
    return dialect
  }

  return await loadDialect(dialect)
}
