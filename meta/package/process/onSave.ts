import { processResourceOnSave } from "../../resource/index.js"
import type { Package } from "../Package.js"

export function processPackageOnSave(props: {
  datapack: Package
  basepath: string
}) {
  processResources(props)
}

function processResources(props: { datapack: Package; basepath: string }) {
  for (const resource of props.datapack.resources) {
    processResourceOnSave({ resource, basepath: props.basepath })
  }
}
