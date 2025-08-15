import type { Descriptor, Resource } from "@dpkit/core"
import { validateResourceDescriptor } from "@dpkit/core"
import { validateTable } from "../table/index.ts"

export async function validateResource(
  descriptorOrResource: Descriptor | Partial<Resource>,
  options?: {
    basepath?: string
  },
) {
  const { valid, errors, resource } = await validateResourceDescriptor(
    descriptorOrResource,
    { basepath: options?.basepath },
  )

  if (!resource) {
    return { valid, errors }
  }

  if (resource.bytes && resource.hash) {
  }

  try {
    return await validateTable(resource)
  } catch {
    return { valid: true, errors: [] }
  }
}
