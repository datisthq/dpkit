import type { Dialect } from "../Dialect.js"

export function denormalizeDialect(props: { dialect: Dialect }) {
  const dialect = globalThis.structuredClone(props.dialect)
  return dialect
}
