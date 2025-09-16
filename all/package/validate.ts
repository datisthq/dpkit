import type { Descriptor, Package } from "@dpkit/core"
import { validatePackageDescriptor } from "@dpkit/core"
import { AssertionError } from "@dpkit/core"
import { validateResource } from "../resource/index.ts"
import { loadPackage } from "./load.ts"

// TODO: Improve implementation
// TODO: Support multipart resources? (clarify on the specs level)

export async function validatePackage(
  source: string | Descriptor | Partial<Package>,
  options?: { basepath?: string },
) {
  let dataPackage: Package | undefined

  if (typeof source === "string") {
    try {
      dataPackage = await loadPackage(source)
    } catch (error) {
      if (error instanceof AssertionError) {
        return { valid: false, errors: error.errors }
      }

      throw error
    }
  } else {
    const result = await validatePackageDescriptor(source, {
      basepath: options?.basepath,
    })

    if (!result.dataPackage) {
      return { valid: false, errors: result.errors }
    }

    dataPackage = result.dataPackage
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
