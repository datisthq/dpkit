import type { Dialect, Resource } from "@dpkit/core"
import type { InferDialectOptions } from "@dpkit/table"
import { system } from "../system.ts"

// TODO: review default values being {} vs undefined

export async function inferDialect(
  resource: Partial<Resource>,
  options?: InferDialectOptions,
) {
  let dialect: Dialect = {}

  for (const plugin of system.plugins) {
    const result = await plugin.inferDialect?.(resource, options)
    if (result) {
      dialect = result
    }
  }

  return dialect
}
