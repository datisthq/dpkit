import type { Descriptor, Package } from "@dpkit/core"
import { loadDescriptor, validatePackageDescriptor } from "@dpkit/core"
import { dpkit } from "../plugin.ts"
import { validateResource } from "../resource/index.ts"

// TODO: Improve implementation
// TODO: Support multipart resources? (clarify on the specs level)

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
      const result = await loadDescriptor(source)
      descriptor = result.descriptor
      basepath = result.basepath
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

  const resourceErrors = (
    await Promise.all(
      dataPackage.resources.map(async resource => {
        const { errors } = await validateResource(resource)
        return errors.map(error => ({ ...error, resource: resource.name }))
      }),
    )
  ).flat()

  const resourceValid = !resourceErrors.length
  return { valid: resourceValid, errors: resourceErrors }
}
