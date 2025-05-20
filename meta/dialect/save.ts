import { saveDescriptor } from "../descriptor/index.js"
import type { Dialect } from "./Dialect.js"
import { denormalizeDialect } from "./process/denormalize.js"

/**
 * Save a Dialect to a file path
 * Works in Node.js environments
 */
export async function saveDialect(props: {
  dialect: Dialect
  path: string
}) {
  const { dialect, path } = props

  denormalizeDialect({ dialect })
  await saveDescriptor({ descriptor: dialect, path })
}
