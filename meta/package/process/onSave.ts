import { processResourceOnSave } from "../../resource/index.js"
import type { Package } from "../Package.js"

type ProcessProps = {
  datapack: Package
  basepath: string
}

export function processPackageOnSave(props: ProcessProps) {
  processResources(props)
}

function processResources(props: ProcessProps) {
  for (const resource of props.datapack.resources) {
    processResourceOnSave({ resource, basepath: props.basepath })
  }
}
