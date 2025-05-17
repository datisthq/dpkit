import { saveDescriptor } from "../descriptor/index.js"
import type { Dialect } from "./Dialect.js"

/**
 * Save a Dialect to a file path
 * Works in Node.js environments
 */
export async function saveDialect(props: {
  dialect: Dialect
  path: string
}) {
  await saveDescriptor({
    descriptor: props.dialect,
    path: props.path,
  })
}
