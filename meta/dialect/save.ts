import { saveDescriptor } from "../descriptor/index.js"
import type { Dialect } from "./Dialect.js"
import { processDialectOnSave } from "./process/onSave.js"

/**
 * Save a Dialect to a file path
 * Works in Node.js environments
 */
export async function saveDialect(props: {
  dialect: Dialect
  path: string
}) {
  const { dialect, path } = props

  await processDialectOnSave({ dialect })
  await saveDescriptor({ descriptor: dialect, path })
}
