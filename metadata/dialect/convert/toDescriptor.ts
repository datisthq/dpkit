import type { Descriptor } from "../../descriptor/index.ts"
import type { Dialect } from "../Dialect.ts"

export function convertDialectToDescriptor(dialect: Dialect) {
  dialect = globalThis.structuredClone(dialect)

  return dialect as Descriptor
}
