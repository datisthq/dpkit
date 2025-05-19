import type { Descriptor } from "../../descriptor/index.js"
import { processResourceOnLoad } from "../../resource/index.js"

export function processPackageOnLoad(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  compatContributors(props)
  processResources(props)
}

function compatContributors(props: { descriptor: Descriptor }) {
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

function processResources(props: {
  descriptor: Descriptor
  basepath?: string
}) {
  for (const resource of props.descriptor.resources) {
    processResourceOnLoad({
      descriptor: resource,
      basepath: props.basepath,
    })
  }
}
