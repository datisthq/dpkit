import type { Resource } from "@dpkit/core"
import type { JsonDocumentError } from "@dpkit/core"
import { createReport } from "@dpkit/core"

export async function validateDocument(resource: Partial<Resource>) {
  const errors: JsonDocumentError[] = []

  if (resource.jsonSchema) {
  }
}
