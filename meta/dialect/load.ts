import { loadDescriptor } from "../descriptor/load.js"
import type { Dialect } from "./Dialect.js"

export async function loadDialect(props: { path: string }) {
  const descriptor = await loadDescriptor(props)
  // TODO: validate descriptor against schema
  return descriptor as Dialect
}
