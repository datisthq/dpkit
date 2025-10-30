import type { Descriptor } from "../../general/index.ts"
import { isRemotePath } from "../../general/index.ts"
import { convertResourceFromDescriptor } from "../../resource/index.ts"

export function convertPackageFromDescriptor(
  descriptor: Descriptor,
  options: {
    basepath?: string
  },
) {
  descriptor = globalThis.structuredClone(descriptor)

  convertProfile(descriptor)
  convertResources(descriptor, options)
  convertContributors(descriptor)

  return descriptor
}

function convertProfile(descriptor: Descriptor) {
  const remoteProfile =
    typeof descriptor.profile === "string" && isRemotePath(descriptor.profile)
      ? descriptor.profile
      : undefined

  descriptor.$schema = descriptor.$schema ?? remoteProfile
}

function convertResources(
  descriptor: Descriptor,
  options: {
    basepath?: string
  },
) {
  if (Array.isArray(descriptor.resources)) {
    descriptor.resources = descriptor.resources.map((resource: Descriptor) =>
      convertResourceFromDescriptor(resource, { basepath: options.basepath }),
    )
  }
}

function convertContributors(descriptor: Descriptor) {
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
