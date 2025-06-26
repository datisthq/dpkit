import type { Resource } from "@dpkit/core"
import type { InferDialectOptions } from "@dpkit/table"
import { dpkit } from "../plugin.js"

// TODO: implement inferDialect

export async function inferDialect(
  resource: Partial<Resource>,
  options?: InferDialectOptions,
) {
  for (const plugin of dpkit.plugins) {
    const dialect = await plugin.inferDialect?.(resource, options)
    if (dialect) {
      return dialect
    }
  }

  throw new Error(`No plugin can infer the dialect: ${resource}`)
}
