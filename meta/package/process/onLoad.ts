import type { Descriptor } from "../../descriptor/index.js"
import { processResourceOnLoad } from "../../resource/index.js"

type ProcessProps = {
  descriptor: Descriptor
  basepath?: string
}

export function processPackageOnLoad(props: ProcessProps) {
  makeCompatible(props)
  processResources(props)
}

function makeCompatible(props: ProcessProps) {
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

function processResources(props: ProcessProps) {
  for (const resource of props.descriptor.resources) {
    processResourceOnLoad({
      descriptor: resource,
      basepath: props.basepath,
    })
  }
}
