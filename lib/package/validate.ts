import type { Descriptor, Package } from "@dpkit/core"
import { loadDescriptor, validatePackageDescriptor } from "@dpkit/core"
import { resolveBasepath } from "@dpkit/core"
import { dpkit } from "../plugin.ts"
import { validateResourceData } from "../resource/index.ts"

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

  const { valid, errors, dataPackage } = await validatePackageDescriptor(
    descriptor,
    { basepath },
  )

  if (!dataPackage) {
    return {
      valid,
      errors: errors.map(error => ({ ...error, resource: undefined })),
    }
  }

  return await validatePackageData(dataPackage)
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
