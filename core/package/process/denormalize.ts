import { denormalizeResource } from "../../resource/index.js"
import type { Package } from "../Package.js"

export function denormalizePackage(props: {
  datapack: Package
  basepath: string
}) {
  denormalizeResources(props)
}

function denormalizeResources(props: { datapack: Package; basepath: string }) {
  for (const resource of props.datapack.resources) {
    denormalizeResource({ resource, basepath: props.basepath })
  }
}
