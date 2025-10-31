import type { Descriptor } from "../descriptor/index.ts"
import { loadDialect } from "../dialect/index.ts"
import { AssertionError } from "../error/index.ts"
import { validateDescriptor } from "../profile/index.ts"
import { loadProfile } from "../profile/index.ts"
import { loadSchema } from "../schema/index.ts"
import type { Resource } from "./Resource.ts"
import { convertResourceFromDescriptor } from "./convert/fromDescriptor.ts"

const DEFAULT_PROFILE = "https://datapackage.org/profiles/1.0/dataresource.json"

/**
 * Validate a Resource descriptor (JSON Object) against its profile
 */
export async function validateResourceMetadata(
  source: Descriptor | Resource,
  options?: {
    basepath?: string
  },
) {
  const descriptor = source as Descriptor

  const $schema =
    typeof descriptor.$schema === "string"
      ? descriptor.$schema
      : DEFAULT_PROFILE

  const profile = await loadProfile($schema)
  let { valid, errors } = await validateDescriptor(descriptor, { profile })

  let resource: Resource | undefined = undefined
  if (valid) {
    // Validation + normalization = we can cast it
    resource = convertResourceFromDescriptor(descriptor, {
      basepath: options?.basepath,
    }) as unknown as Resource
  }

  if (resource) {
    const dialectErorrs = await validateDialectIfExternal(resource)
    if (dialectErorrs) errors.push(...dialectErorrs)

    const schemaErorrs = await validateSchemaIfExternal(resource)
    if (schemaErorrs) errors.push(...schemaErorrs)

    if (errors.length) {
      resource = undefined
      valid = false
    }
  }

  return { valid, errors, resource }
}

async function validateDialectIfExternal(resource: Resource) {
  if (typeof resource.dialect === "string") {
    try {
      await loadDialect(resource.dialect)
    } catch (error) {
      if (error instanceof AssertionError) {
        return error.errors
      }
    }
  }

  return undefined
}

async function validateSchemaIfExternal(resource: Resource) {
  if (typeof resource.schema === "string") {
    try {
      await loadSchema(resource.schema)
    } catch (error) {
      if (error instanceof AssertionError) {
        return error.errors
      }
    }
  }

  return undefined
}
