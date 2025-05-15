import type { Descriptor } from "../descriptor/Descriptor.js"
import { loadDescriptor } from "../descriptor/load.js"
import type { Dialect } from "./Dialect.js"
import { validateDialect } from "./validate.js"

export async function loadDialect(props: { source: string | Descriptor }) {
  const descriptor =
    typeof props.source === "string"
      ? await loadDescriptor({ path: props.source })
      : props.source

  await validateDialect({ descriptor, orThrow: true })
  return descriptor as Dialect
}
