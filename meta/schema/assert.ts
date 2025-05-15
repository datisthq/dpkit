import { type Descriptor, assertDescriptor } from "../descriptor/index.js"
import type { Schema } from "./Schema.js"
import defaultProfile from "./profiles/schema-1.0.json" with { type: "json" }

/**
 * Assert a Schema descriptor (JSON Object) against its profile
 */
export async function assertSchema(props: { descriptor: Descriptor }) {
  const schema = await assertDescriptor<Schema>({ ...props, defaultProfile })
  return schema
}
