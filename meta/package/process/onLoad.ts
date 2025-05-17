import type { Descriptor } from "../../descriptor/index.js"
import { processResourceOnLoad } from "../../resource/index.js"

type ProcessProps = {
  descriptor: Descriptor
  basepath?: string
}

export async function processPackageOnLoad(props: ProcessProps) {
  await processResources(props)
}

async function processResources(props: ProcessProps) {
  for (const resource of props.descriptor.resources) {
    await processResourceOnLoad({
      descriptor: resource,
      basepath: props.basepath,
    })
  }
}
