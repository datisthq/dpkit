import type { Descriptor } from "../../general/index.js"
import { normalizeResource } from "../../resource/index.js"

export function normalizePackage(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { basepath } = props
  const descriptor = globalThis.structuredClone(props.descriptor)

  normalizeResources({ descriptor, basepath })
  normalizeContributors({ descriptor })

  return descriptor
}

function normalizeResources(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  const { descriptor, basepath } = props

  if (Array.isArray(descriptor.resources)) {
    descriptor.resources = descriptor.resources.map((resource: Descriptor) =>
      normalizeResource({ descriptor: resource, basepath }),
    )
  }
}

function normalizeContributors(props: { descriptor: Descriptor }) {
  const { descriptor } = props

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
