import type { Descriptor, Resource } from "@dpkit/core"
import { loadResourceSchema } from "@dpkit/core"
import { loadDescriptor, validateResourceDescriptor } from "@dpkit/core"
import { validateFile } from "@dpkit/file"
import { validateTable } from "@dpkit/table"
import type { InferSchemaOptions } from "@dpkit/table"
import { inferSchema } from "../schema/index.ts"
import { loadTable } from "../table/index.ts"

// TODO: Support multipart resources? (clarify on the specs level)

export async function validateResource(
  source: string | Descriptor | Partial<Resource>,
  options?: InferSchemaOptions & { basepath?: string },
) {
  let descriptor = source
  let basepath = options?.basepath

  if (typeof descriptor === "string") {
    const result = await loadDescriptor(descriptor)
    descriptor = result.descriptor
    basepath = result.basepath
  }

  const { valid, errors, resource } = await validateResourceDescriptor(
    descriptor,
    { basepath },
  )

  if (!resource) {
    return { valid, errors }
  }

  if (resource.bytes || resource.hash) {
    if (typeof resource.path === "string") {
      return await validateFile(resource.path, {
        bytes: resource.bytes,
        hash: resource.hash,
      })
    }
  }

  const table = await loadTable(resource, { denormalized: true })
  if (table) {
    let schema = await loadResourceSchema(resource.schema)
    if (!schema) schema = await inferSchema(resource, options)
  }

  try {
    // TODO: rebase on not-rasing?
    // It will raise if the resource is not a table

    return await validateTable(table, { schema })
  } catch {}

  return { valid: true, errors: [] }
}
