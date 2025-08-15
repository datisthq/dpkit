import type { Descriptor, Resource } from "@dpkit/core"
import { validateResourceDescriptor } from "@dpkit/core"
import { validateFile } from "@dpkit/file"
import { validateTable } from "../table/index.ts"

// TODO: Support multipart resources? (clarify on the specs level)

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

  if (resource.bytes || resource.hash) {
    if (typeof resource.path === "string") {
      return await validateFile(resource.path, {
        bytes: resource.bytes,
        hash: resource.hash,
      })
    }
  }

  try {
    // TODO: rebase on not-rasing?
    // It will raise if the resource is not a table
    return await validateTable(resource)
  } catch {}

  return { valid: true, errors: [] }
}
