import { saveDescriptor } from "../general/index.js"
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

  const descriptor = denormalizeDialect({ dialect })

  descriptor.$schema =
    descriptor.$schema ?? descriptor.profile ?? CURRENT_PROFILE

  await saveDescriptor({ descriptor, path })
}

const CURRENT_PROFILE = "https://datapackage.org/profiles/2.0/tabledialect.json"
