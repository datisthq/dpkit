import { loadDialect } from "../dialect/index.js"
import { type Descriptor, validateDescriptor } from "../general/index.js"
import { AssertionError } from "../general/index.js"
import { loadProfile } from "../general/index.js"
import { loadSchema } from "../schema/index.js"
import type { Resource } from "./Resource.js"
import { normalizeResource } from "./process/normalize.js"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/dataresource.json"

/**
 * Validate a Resource descriptor (JSON Object) against its profile
 */
export async function validateResourceDescriptor(props: {
  descriptor: Descriptor | Resource
  basepath?: string
}) {
  const { basepath } = props
  const descriptor = props.descriptor as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile({ path: $schema })
  let { valid, errors } = await validateDescriptor({ descriptor, profile })

  let resource: Resource | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    resource = normalizeResource({
      descriptor,
      basepath,
    }) as unknown as Resource
  }

  if (resource) {
    const dialectErorrs = await validateDialectIfExternal({ resource })
    if (dialectErorrs) errors.push(...dialectErorrs)

    const schemaErorrs = await validateSchemaIfExternal({ resource })
    if (schemaErorrs) errors.push(...schemaErorrs)

    if (errors.length) {
      resource = undefined
      valid = false
    }
  }

  return { valid, errors, resource }
}

async function validateDialectIfExternal(props: { resource: Resource }) {
  const { resource } = props

  if (typeof resource.dialect === "string") {
    try {
      await loadDialect({ path: resource.dialect })
    } catch (error) {
      if (error instanceof AssertionError) {
        return error.errors
      }
    }
  }

  return undefined
}

async function validateSchemaIfExternal(props: { resource: Resource }) {
  const { resource } = props

  if (typeof resource.schema === "string") {
    try {
      await loadSchema({ path: resource.schema })
    } catch (error) {
      if (error instanceof AssertionError) {
        return error.errors
      }
    }
  }

  return undefined
}
