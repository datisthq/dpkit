import type { Descriptor, Resource } from "@dpkit/core"
import { resolveSchema } from "@dpkit/core"
import { loadDescriptor, validateResourceMetadata } from "@dpkit/core"
import { validateFile } from "@dpkit/file"
import { validateTable } from "@dpkit/table"
import type { InferSchemaOptions } from "@dpkit/table"
import { inferSchema } from "../schema/index.ts"
import { loadTable } from "../table/index.ts"

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

  const { valid, errors, resource } = await validateResourceMetadata(
    descriptor,
    { basepath },
  )

  if (!resource) {
    return { valid, errors }
  }

  return await validateResourceData(resource, options)
}

export async function validateResourceData(
  resource: Partial<Resource>,
  options?: InferSchemaOptions,
) {
  const fileReport = await validateFile(resource.path, {
    bytes: resource.bytes,
    hash: resource.hash,
    encoding: resource.encoding,
  })

  if (!fileReport.valid) {
    return fileReport
  }

  let schema = await resolveSchema(resource.schema)
  const table = await loadTable(resource, { denormalized: true })

  if (table) {
    if (!schema) schema = await inferSchema(resource, options)
    const tableReport = await validateTable(table, { schema })

    if (!tableReport.valid) {
      return tableReport
    }
  } else if (schema) {
    const error = {}
  }

  return { valid: true, errors: [] }
}
