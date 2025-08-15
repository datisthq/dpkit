import type { Descriptor, Resource } from "@dpkit/core"
import { loadDescriptor, validateResourceDescriptor } from "@dpkit/core"
import { validateFile } from "@dpkit/file"
import { validateTable } from "../table/index.ts"

// TODO: Support multipart resources? (clarify on the specs level)

export async function validateResource(
  pathOrDescriptorOrResource: string | Descriptor | Partial<Resource>,
  options?: { basepath?: string },
) {
  let descriptor = pathOrDescriptorOrResource
  let basepath = options?.basepath

  if (typeof descriptor === "string") {
    const result = await loadDescriptor(descriptor)
    descriptor = result.descriptor
    basepath = result.basepath
  }

  const { valid, errors, resource } = await validateResourceDescriptor(
    descriptor,
    { basepath },
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
