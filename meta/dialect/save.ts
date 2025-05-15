import { saveMetadata } from "../metadata/save.js"
import type { Dialect } from "./Dialect.js"

/**
 * Save a Dialect to a file path
 * Works in Node.js environments
 */
export async function saveDialect(props: { dialect: Dialect; path: string }) {
  const { dialect, path } = props

  return saveMetadata({
    metadata: dialect,
    path,
  })
}
