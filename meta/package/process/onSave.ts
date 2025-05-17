import { processResourceOnSave } from "../../resource/index.js"
import type { Package } from "../Package.js"

type ProcessProps = {
  datapack: Package
  basepath: string
}

export async function processPackageOnSave(props: ProcessProps) {
  processResources(props)
}

async function processResources(props: ProcessProps) {
  for (const resource of props.datapack.resources) {
    await processResourceOnSave({ resource, basepath: props.basepath })
  }
}
