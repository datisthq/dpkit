import type { Dialect, Resource } from "@dpkit/core"
import type { InferDialectOptions } from "@dpkit/table"
import { dpkit } from "../plugin.js"

// TODO: implement inferDialect

export async function inferDialect(
  resource: Partial<Resource>,
  options?: InferDialectOptions,
) {
  let dialect: Dialect = {}

  for (const plugin of dpkit.plugins) {
    const result = await plugin.inferDialect?.(resource, options)
    if (result) {
      dialect = result
    }
  }

  return dialect
}
