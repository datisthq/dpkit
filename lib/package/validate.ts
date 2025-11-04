import os from "node:os"
import { createReport } from "@dpkit/core"
import type { Descriptor, Package } from "@dpkit/core"
import { loadDescriptor, validatePackageMetadata } from "@dpkit/core"
import { resolveBasepath } from "@dpkit/core"
import pAll from "p-all"
import { validateResourceData } from "../resource/index.ts"
import { system } from "../system.ts"
import { validatePackageIntegrity } from "./integrity.ts"

export async function validatePackage(
  source: string | Descriptor | Partial<Package>,
  options?: { basepath?: string },
) {
  let descriptor: Descriptor | undefined
  let basepath = options?.basepath

  if (typeof source !== "string") {
    descriptor = source
  } else {
    for (const plugin of system.plugins) {
      const result = await plugin.loadPackage?.(source)
      if (result) {
        descriptor = result as unknown as Descriptor
        break
      }
    }

    if (!descriptor) {
      basepath = await resolveBasepath(source)
      descriptor = await loadDescriptor(source)
    }
  }

  const metadataReport = await validatePackageMetadata(descriptor, {
    basepath,
  })

  if (!metadataReport.dataPackage) {
    return {
      valid: metadataReport.valid,
      errors: metadataReport.errors.map(error => ({
        ...error,
        resource: undefined,
      })),
    }
  }

  const dataReport = await validatePackageData(metadataReport.dataPackage)
  const integrityReport = await validatePackageIntegrity(
    metadataReport.dataPackage,
  )

  const errors = [...dataReport.errors, ...integrityReport.errors]
  return createReport(errors)
}

// TODO: make private inspect?
export async function validatePackageData(dataPackage: Package) {
  const concurrency = os.cpus().length

  const errors = (
    await pAll(
      dataPackage.resources.map(resource => async () => {
        try {
          const report = await validateResourceData(resource)
          return report.errors.map(error => ({
            ...error,
            resource: resource.name,
          }))
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          throw new Error(`[${resource.name}] ${message}`)
        }
      }),
      { concurrency },
    )
  ).flat()

  return createReport(errors)
}
