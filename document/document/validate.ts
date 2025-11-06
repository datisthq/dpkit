import type { Resource } from "@dpkit/metadata"
import type { DataError } from "@dpkit/metadata"
import type { JsonDocumentError } from "@dpkit/metadata"
import { createReport } from "@dpkit/metadata"
import { resolveJsonSchema } from "@dpkit/metadata"
import { inspectJsonValue } from "@dpkit/metadata"

export async function validateDocument(resource: Partial<Resource>) {
  if (resource.jsonSchema) {
    const jsonSchema = await resolveJsonSchema(resource.jsonSchema)

    if (!resource.data) {
      return createReport<DataError>([
        {
          type: "data",
          message: `missing ${resource.name} data`,
        },
      ])
    }

    if (jsonSchema) {
      const errors = await inspectJsonValue(resource.data, { jsonSchema })

      return createReport<JsonDocumentError>(
        errors.map(error => ({
          type: "document/json",
          ...error,
        })),
      )
    }
  }

  return createReport()
}
