import type { Resource } from "@dpkit/core"
import type { DataError } from "@dpkit/core"
import type { JsonDocumentError } from "@dpkit/core"
import { createReport } from "@dpkit/core"
import { resolveJsonSchema } from "@dpkit/core"
import { inspectJsonValue } from "@dpkit/core"

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
