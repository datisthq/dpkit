import type { Descriptor, Package } from "@dpkit/core"
import { loadDescriptor, validatePackageDescriptor } from "@dpkit/core"
import { validateResource } from "../resource/index.ts"

// TODO: Handle error addressing (to which resource an error belongs)
// TODO: Support multipart resources? (clarify on the specs level)

export async function validatePackage(
  pathOrDescriptorOrPackage: string | Descriptor | Partial<Package>,
  options?: { basepath?: string },
) {
  let descriptor = pathOrDescriptorOrPackage
  let basepath = options?.basepath

  if (typeof descriptor === "string") {
    const result = await loadDescriptor(descriptor)
    descriptor = result.descriptor
    basepath = result.basepath
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
