import type { Descriptor, Resource } from "@dpkit/core"
import { createReport } from "@dpkit/core"
import { loadDescriptor, validateResourceMetadata } from "@dpkit/core"
import { resolveBasepath } from "@dpkit/core"
import { validateFile } from "@dpkit/file"
import type { InferSchemaOptions } from "@dpkit/table"
import { validateTable } from "../table/index.ts"

export async function validateResource(
  source: string | Descriptor | Partial<Resource>,
  options?: InferSchemaOptions & { basepath?: string },
) {
  let descriptor = source
  let basepath = options?.basepath

  if (typeof descriptor === "string") {
    basepath = await resolveBasepath(descriptor)
    descriptor = await loadDescriptor(descriptor)
  }

  const report = await validateResourceMetadata(descriptor, { basepath })

  if (!report.resource) {
    return report
  }

  return await validateResourceData(report.resource, options)
}

export async function validateResourceData(
  resource: Partial<Resource>,
  options?: InferSchemaOptions,
) {
  const fileReport = await validateFile(resource)
  if (!fileReport.valid) {
    return fileReport
  }

  const tableReport = await validateTable(resource, options)
  if (!tableReport.valid) {
    return tableReport
  }

  return createReport()
}
