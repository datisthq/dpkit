import type { Resource } from "@dpkit/core"
import { createReport } from "@dpkit/core"
import { resolveProfile } from "@dpkit/core"
import { validateDescriptor } from "@dpkit/core"

export async function validateDocument(resource: Partial<Resource>) {
  if (resource.jsonSchema) {
    const profile = await resolveProfile(resource.jsonSchema)

    if (!resource.data) {
      return createReport([
        {
          type: "data",
          message: `missing ${resource.name} data`,
        },
      ])
    }

    if (profile) {
      // @ts-ignore
      const report = await validateDescriptor(resource.data, { profile })
      if (!report.valid) {
        return report
      }
    }
  }

  return createReport()
}
