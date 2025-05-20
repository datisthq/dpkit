import type { Descriptor } from "../../descriptor/index.js"
import { normalizeResource } from "../../resource/index.js"

export function normalizePackage(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  normalizeResources(props)
  normalizeContributors(props)
}

function normalizeResources(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  for (const resource of props.descriptor.resources) {
    normalizeResource({
      descriptor: resource,
      basepath: props.basepath,
    })
  }
}

function normalizeContributors(props: { descriptor: Descriptor }) {
  const { descriptor } = props
  const contributors = descriptor.contributors

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
