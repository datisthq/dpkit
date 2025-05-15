import { type Descriptor, assertDescriptor } from "../descriptor/index.js"
import type { Dialect } from "./Dialect.js"
import defaultProfile from "./profiles/dialect-1.0.json" with { type: "json" }

/**
 * Assert a Dialect descriptor (JSON Object) against its profile
 */
export async function assertDialect(props: { descriptor: Descriptor }) {
  const dialect = await assertDescriptor<Dialect>({ ...props, defaultProfile })
  return dialect
}
