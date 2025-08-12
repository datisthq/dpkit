import type { Descriptor } from "../../general/index.ts"
import type { Dialect } from "../Dialect.ts"

export function denormalizeDialect(dialect: Dialect) {
  dialect = globalThis.structuredClone(dialect)

  return dialect as Descriptor
}
