import type { Descriptor, Package } from "@dpkit/core"
import { loadDescriptor, validatePackageMetadata } from "@dpkit/core"
import { resolveBasepath } from "@dpkit/core"
import { validatePackageForeignKeys } from "@dpkit/table"
import { dpkit } from "../plugin.ts"
import { validateResourceData } from "../resource/index.ts"
import { loadTable } from "../table/index.ts"

export async function validatePackage(
  source: string | Descriptor | Partial<Package>,
  options?: { basepath?: string },
) {
  let descriptor: Descriptor | undefined
  let basepath = options?.basepath

  if (typeof source !== "string") {
    descriptor = source
  } else {
    for (const plugin of dpkit.plugins) {
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
  const fkReport = await validatePackageForeignKeys(
    metadataReport.dataPackage,
    { loadTable },
  )

  const errors = [...dataReport.errors, ...fkReport.errors]
  return { valid: errors.length === 0, errors }
}

export async function validatePackageData(dataPackage: Package) {
  const errors = (
    await Promise.all(
      dataPackage.resources.map(async resource => {
        try {
          const { errors } = await validateResourceData(resource)
          return errors.map(error => ({ ...error, resource: resource.name }))
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error)
          throw new Error(`[${resource.name}] ${message}`)
        }
      }),
    )
  ).flat()

  const valid = !errors.length
  return { valid, errors: errors }
}
