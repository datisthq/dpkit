import type { Descriptor } from "../../general/index.ts"
import { normalizeResource } from "../../resource/index.ts"

export function normalizePackage(
  descriptor: Descriptor,
  options: {
    basepath?: string
  },
) {
  descriptor = globalThis.structuredClone(descriptor)

  normalizeProfile(descriptor)
  normalizeResources(descriptor, options)
  normalizeContributors(descriptor)

  return descriptor
}

function normalizeProfile(descriptor: Descriptor) {
  descriptor.$schema = descriptor.$schema ?? descriptor.profile
}

function normalizeResources(
  descriptor: Descriptor,
  options: {
    basepath?: string
  },
) {
  if (Array.isArray(descriptor.resources)) {
    descriptor.resources = descriptor.resources.map((resource: Descriptor) =>
      normalizeResource(resource, { basepath: options.basepath }),
    )
  }
}

function normalizeContributors(descriptor: Descriptor) {
  const contributors = descriptor.contributors
  if (!contributors) {
    return
  }

  if (Array.isArray(contributors)) {
    for (const contributor of contributors) {
      const role = contributor.role
      if (role) {
        contributor.roles = [role]
        contributor.role = undefined
      }
    }
  }
}
