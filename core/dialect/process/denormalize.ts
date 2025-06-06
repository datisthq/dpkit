import type { Descriptor } from "../../general/index.js"
import type { Dialect } from "../Dialect.js"

export function denormalizeDialect(dialect: Dialect) {
  dialect = globalThis.structuredClone(dialect)

  return dialect as Descriptor
}
